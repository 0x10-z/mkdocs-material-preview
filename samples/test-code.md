# Code Block Enhancement Tests

## Code with Title

```py title="hello.py"
def hello():
    print("Hello, World!")

if __name__ == "__main__":
    hello()
```

## Code with Line Highlighting

```py hl_lines="2 4"
def process():
    important_step()   # This line is highlighted
    normal_step()
    another_key_step() # This line is also highlighted
    cleanup()
```

## Code with Line Numbers

```py linenums="1"
import os
import sys

def main():
    path = os.getcwd()
    print(f"Working in: {path}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

## Code with All Enhancements

```py title="example.py" hl_lines="3-5" linenums="10"
class Calculator:
    def __init__(self):
        self.result = 0    # highlighted
        self.history = []   # highlighted
        self.precision = 2  # highlighted

    def add(self, value):
        self.result += value
        return self
```

## Regular Code Block (no enhancements)

```python
# This should render normally without any enhancements
print("Just a regular code block")
```
