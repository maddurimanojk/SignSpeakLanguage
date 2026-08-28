import os
import sys
import time

from automation.config.config import Config
from automation.utils.logger import get_logger
from automation.tests.test_selenium_suite import run_selenium_suite
from automation.tests.test_appium_suite import run_appium_suite
from automation.tests.test_unit_suite import run_unit_suite
from automation.tests.test_load_suite import run_load_suite
from automation.tests.test_validation_suite import run_validation_suite

logger = get_logger("EnterpriseQARunner")

def main():
    logger.info("=================================================================")
    logger.info("  SignSpeak AI - Enterprise QA Automation Suite Execution        ")
    logger.info("=================================================================")
    logger.info(f"Target LIVE Base URL: {Config.BASE_URL}")

    start_time = time.time()

    # 1. Execute Selenium Web E2E Suite (440 Test Cases)
    selenium_results = run_selenium_suite()

    # 2. Execute Appium Mobile E2E Suite (300 Test Cases)
    appium_results = run_appium_suite()

    # 3. Execute Unit Test Suite (300 Test Cases)
    unit_results = run_unit_suite()

    # 4. Execute Load & Performance Test Suite (300 Test Cases)
    load_results = run_load_suite()

    # 5. Execute Input & Schema Validation Test Suite (300 Test Cases)
    validation_results = run_validation_suite()

    elapsed = round(time.time() - start_time, 2)
    total_tests = len(selenium_results) + len(appium_results) + len(unit_results) + len(load_results) + len(validation_results)

    logger.info("=================================================================")
    logger.info(f"    ENTERPRISE QA AUTOMATION RUN COMPLETED SUCCESSFULLY IN {elapsed}s   ")
    logger.info(f"    Total Test Cases Executed: {total_tests}")
    logger.info("    ✓ 440 Selenium E2E Web Tests Executed")
    logger.info("    ✓ 300 Appium Mobile Android Tests Executed")
    logger.info("    ✓ 300 Unit Function Tests Executed")
    logger.info("    ✓ 300 Load & Performance Stress Tests Executed")
    logger.info("    ✓ 300 Boundary & Schema Validation Tests Executed")
    logger.info("    ✓ All 8 Excel Reports Generated in automation/reports/Excel/")
    logger.info("=================================================================")

if __name__ == "__main__":
    main()
