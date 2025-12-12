# Romaji Parser

A simple parser for converting Romaji input into Japanese kana (Hiragana/Katakana).

## Installation

```bash
# Example: if this were a Python package
pip install romaji-parser
```

## Usage

```python
# Example: if this were a Python package
from romaji_parser import RomajiParser

parser = RomajiParser()
hiragana = parser.to_hiragana("konnichiwa")
print(hiragana) # Output: こんにちは

katakana = parser.to_katakana("konnichiwa")
print(katakana) # Output: コンニチハ
```

## Features

- Converts common Romaji spellings to Hiragana.
- Converts common Romaji spellings to Katakana.
- Handles basic double consonants and long vowels.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
```

