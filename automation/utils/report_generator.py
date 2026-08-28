import os
import json
import time
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from automation.config.config import Config
from automation.utils.logger import get_logger

logger = get_logger("ReportGenerator")

os.makedirs(Config.REPORTS_DIR, exist_ok=True)
excel_dir = os.path.join(Config.REPORTS_DIR, "Excel")
html_dir = os.path.join(Config.REPORTS_DIR, "HTML")
json_dir = os.path.join(Config.REPORTS_DIR, "JSON")
summary_dir = os.path.join(Config.REPORTS_DIR, "Summary")

for d in [excel_dir, html_dir, json_dir, summary_dir]:
    os.makedirs(d, exist_ok=True)

HEADER_FILL = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
HEADER_FONT = Font(name="Arial", size=11, bold=True, color="FFFFFF")
PASS_FILL = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")
PASS_FONT = Font(name="Arial", size=10, bold=True, color="166534")
FAIL_FILL = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
FAIL_FONT = Font(name="Arial", size=10, bold=True, color="991B1B")
SKIP_FILL = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
SKIP_FONT = Font(name="Arial", size=10, bold=True, color="92400E")

THIN_BORDER = Border(
    left=Side(style='thin', color='CBD5E1'),
    right=Side(style='thin', color='CBD5E1'),
    top=Side(style='thin', color='CBD5E1'),
    bottom=Side(style='thin', color='CBD5E1')
)

def create_styled_excel(file_path: str, sheets_data: dict):
    wb = openpyxl.Workbook()
    wb.remove(wb.active) # Remove default sheet
    
    for sheet_name, data in sheets_data.items():
        ws = wb.create_sheet(title=sheet_name)
        
        # Write headers
        headers = data.get("headers", [])
        ws.append(headers)
        for col_num in range(1, len(headers) + 1):
            cell = ws.cell(row=1, column=col_num)
            cell.fill = HEADER_FILL
            cell.font = HEADER_FONT
            cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
            cell.border = THIN_BORDER

        # Write rows
        rows = data.get("rows", [])
        for row_idx, row_data in enumerate(rows, start=2):
            ws.append(row_data)
            for col_num in range(1, len(row_data) + 1):
                cell = ws.cell(row=row_idx, column=col_num)
                cell.border = THIN_BORDER
                cell.alignment = Alignment(vertical="center", wrap_text=True)
                
                val_str = str(cell.value or "").upper()
                if val_str in ["PASSED", "PASS"]:
                    cell.fill = PASS_FILL
                    cell.font = PASS_FONT
                elif val_str in ["FAILED", "FAIL"]:
                    cell.fill = FAIL_FILL
                    cell.font = FAIL_FONT
                elif val_str in ["SKIPPED", "BLOCKED"]:
                    cell.fill = SKIP_FILL
                    cell.font = SKIP_FONT

        # Adjust column widths
        for col in ws.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = get_column_letter(col[0].column)
            ws.column_dimensions[col_letter].width = min(max(max_len + 4, 15), 60)
            
    wb.save(file_path)
    logger.info(f"Generated Excel report: {file_path}")

def generate_all_reports(test_results: list, report_title: str = "SignSpeak AI Enterprise QA Report"):
    total = len(test_results)
    passed = [r for r in test_results if r["status"] == "PASSED"]
    failed = [r for r in test_results if r["status"] == "FAILED"]
    skipped = [r for r in test_results if r["status"] in ["SKIPPED", "BLOCKED"]]
    
    pass_rate = round((len(passed) / total) * 100, 2) if total > 0 else 0.0

    passed_headers = ["Test ID", "Module", "Test Name", "Status", "Reason for Passing", "Execution Time (s)", "Evidence / Validation Details"]
    failed_headers = ["Test ID", "Module", "Test Name", "Status", "Failure Reason", "Expected Behavior", "Actual Result", "Execution Time (s)"]
    all_headers = ["Test ID", "Module", "Test Name", "Status", "Reason for Passing / Failure Reason", "Execution Time (s)", "Evidence / Validation Details"]

    passed_rows = [
        [r["id"], r["module"], r["name"], r["status"], r.get("pass_reason", "Verified behavior matched expected criteria."), r["duration"], r.get("evidence", "Validation OK")]
        for r in passed
    ]

    failed_rows = [
        [r["id"], r["module"], r["name"], r["status"], r.get("reason", "Assertion Failure"), r.get("pass_reason", "Expected assertion to hold true"), r.get("evidence", "Assertion failed at runtime"), r["duration"]]
        for r in failed
    ]

    skipped_rows = [
        [r["id"], r["module"], r["name"], r["status"], r.get("reason", "Environment unavailable"), r["duration"], r.get("evidence", "Skipped")]
        for r in skipped
    ]

    all_rows = [
        [
            r["id"],
            r["module"],
            r["name"],
            r["status"],
            r.get("pass_reason", r.get("reason", "Executed")),
            r["duration"],
            r.get("evidence", "Validation OK")
        ]
        for r in test_results
    ]

    sheets_all = {
        "Executed Test Cases": {"headers": all_headers, "rows": all_rows},
        "Passed Tests": {"headers": passed_headers, "rows": passed_rows},
        "Failed Tests": {"headers": failed_headers, "rows": failed_rows},
        "Skipped & Blocked Tests": {"headers": ["Test ID", "Module", "Test Name", "Status", "Reason", "Duration", "Evidence"], "rows": skipped_rows},
        "Execution Metrics": {
            "headers": ["Metric", "Value"],
            "rows": [
                ["Total Executed Test Cases", total],
                ["Passed Test Cases", len(passed)],
                ["Failed Test Cases", len(failed)],
                ["Skipped / Blocked Test Cases", len(skipped)],
                ["Pass Percentage", f"{pass_rate}%"],
                ["Target Base URL", Config.BASE_URL],
                ["Execution Timestamp", time.strftime("%Y-%m-%d %H:%M:%S")]
            ]
        }
    }

    # 1. Main Automation_Test_Report.xlsx
    main_excel = os.path.join(excel_dir, "Automation_Test_Report.xlsx")
    create_styled_excel(main_excel, sheets_all)
    
    # 2. Passed_Test_Cases.xlsx
    passed_excel = os.path.join(excel_dir, "Passed_Test_Cases.xlsx")
    create_styled_excel(passed_excel, {"Passed Tests": sheets_all["Passed Tests"]})
    
    # 3. Failed_Test_Cases.xlsx
    failed_excel = os.path.join(excel_dir, "Failed_Test_Cases.xlsx")
    create_styled_excel(failed_excel, {"Failed Tests": sheets_all["Failed Tests"]})
    
    # 4. Summary_Report.xlsx
    summary_excel = os.path.join(excel_dir, "Summary_Report.xlsx")
    create_styled_excel(summary_excel, {"Execution Metrics": sheets_all["Execution Metrics"]})

    # JSON Results
    json_path = os.path.join(json_dir, "execution-results.json")
    with open(json_path, "w") as f:
        json.dump({
            "title": report_title,
            "targetUrl": Config.BASE_URL,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "summary": {"total": total, "passed": len(passed), "failed": len(failed), "skipped": len(skipped), "passRate": pass_rate},
            "testCases": test_results
        }, f, indent=2)

    logger.info("All reports updated with domain reasons and evidence details!")
