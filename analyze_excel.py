#!/usr/bin/env python3
"""
Excel Sheet Analizi
"""
import pandas as pd

xl = pd.ExcelFile('Glindent Web Page.xlsx')

for sheet in xl.sheet_names:
    if sheet == 'Structure':
        continue
    
    df = pd.read_excel(xl, sheet_name=sheet, header=None)
    
    print(f"\n{'='*60}")
    print(f"SHEET: {sheet}")
    print(f"{'='*60}")
    print(f"Rows: {len(df)}, Cols: {len(df.columns)}")
    print("\nFirst 5 rows:")
    print(df.head(5).to_string())
    print("\n")
