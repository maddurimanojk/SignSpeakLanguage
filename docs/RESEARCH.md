# SignSpeak AI — Academic Audit & Research Report

## 1. Research Overview

> **Title**: *"Effectiveness of Real-Time AI-Driven Sign Language to Speech Translation System Compared with Traditional Communication Methods in Improving Communication Accuracy and Accessibility"*

SignSpeak AI is an AI accessibility platform designed for real-time sign language conversion into spoken audio output.

---

## 2. Dataset Provenance & Scope Audit

- **Dataset Used**: Indian Sign Language (ISL) Alphabet Dataset
- **Source Repository**: GitHub (`ayeshatasnim-h/Indian-Sign-Language-dataset`)
- **License**: Open Access GitHub Repository Dataset
- **Dataset Size**: **12,637 static image files (`.jpg`)**
- **Number of Classes**: **26 ISL alphabet gesture classes** (`A` through `Z`)
- **Data Type**: Static RGB hand gesture images (NOT video word signs)
- **Clarification on INCLUDE Benchmark**: The INCLUDE dataset (Sridhar et al., ACM MM '20) is a separate video dataset of 50+ ISL word signs. The current dataset evaluated here is the static ISL Alphabet Image Dataset from `ayeshatasnim-h/Indian-Sign-Language-dataset`.

---

## 3. Methodological Audit & Sequence Analysis

1. **Feature Extraction**:
   - MediaPipe 21-joint 2D hand landmark extraction ($x, y$) normalized relative to the wrist (joint 0) and scaled to unit bounds ($42 \text{ float features}$).
2. **Static Feature Tiling**:
   - Each static image yields 1 normalized 42-feature landmark vector.
   - For compatibility with the sequence classifier, the static vector was replicated 15 times ($15 \text{ frames} \times 42 \text{ features}$).
3. **Model Classification**:
   - The current model acts as a **Static ISL Alphabet Image Classifier**.
   - It is **NOT** a temporal video word-sign model.

---

## 4. Split Methodology & Data Leakage Assessment

- The raw dataset consists of image files without explicit participant metadata.
- Modulo-based indexing used during initial split chunking did not guarantee complete participant isolation across train/val/test splits.
- **Model Evaluation Status**: Model evaluation is pending methodological verification on a strictly partitioned dataset with verified participant/session boundaries.

---

## 5. Scope Distinction: Alphabet vs. Full Translation

| Module | Dataset Type | Model Type | Application Scope |
|---|---|---|---|
| **ISL Alphabet Module** | Static Images (26 Classes `A`–`Z`) | Static Landmark Classifier | Spelling & Letter Recognition |
| **ISL Word/Sentence Translation** | Spatio-Temporal Video Sequences | Temporal LSTM / Transformer | Real-Time Sign-to-Speech Translation |

Alphabet recognition is one structural component of the platform; full sign-language translation requires spatio-temporal video word gesture models.
