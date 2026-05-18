const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
let expression = "";

const updateDisplay = () => {
  display.value = expression;
};

const isOperator = (char) => ["+", "-", "*", "/", "%", "^"].includes(char);

const appendParenthesis = () => {
  const openCount = (expression.match(/\(/g) || []).length;
  const closeCount = (expression.match(/\)/g) || []).length;
  const lastChar = expression.slice(-1);

  if (!expression || isOperator(lastChar) || lastChar === "(") {
    expression += "(";
  } else if (openCount > closeCount && lastChar !== "(") {
    expression += ")";
  } else {
    expression += "(";
  }

  updateDisplay();
};

const applyPercent = () => {
  if (!expression) return;

  const numberMatch = expression.match(/(\d+\.?\d*)$/);
  if (!numberMatch) return;

  const numberValue = Number(numberMatch[0]);
  const percentValue = String(numberValue / 100);
  expression = expression.slice(0, -numberMatch[0].length) + percentValue;
  updateDisplay();
};

const backspace = () => {
  expression = expression.slice(0, -1);
  updateDisplay();
};

const clearDisplay = () => {
  expression = "";
  updateDisplay();
};

const factorial = (n) => {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }
  return result;
};

const calculateResult = () => {
  if (!expression) return;

  let cleanedExpression = expression;

  cleanedExpression = cleanedExpression.replace(/π/g, "Math.PI");
  cleanedExpression = cleanedExpression.replace(/√\(/g, "Math.sqrt(");
  cleanedExpression = cleanedExpression.replace(/\blog\(/g, "Math.log10(");
  cleanedExpression = cleanedExpression.replace(/\bln\(/g, "Math.log(");
  cleanedExpression = cleanedExpression.replace(/\bsin\(/g, "Math.sin(");
  cleanedExpression = cleanedExpression.replace(/\bcos\(/g, "Math.cos(");
  cleanedExpression = cleanedExpression.replace(/\btan\(/g, "Math.tan(");
  cleanedExpression = cleanedExpression.replace(/\bmod\b/g, "%");
  cleanedExpression = cleanedExpression.replace(/\^/g, "**");
  cleanedExpression = cleanedExpression.replace(/(\d+\.?\d*|\([^()]+\))!/g, "factorial($1)");

  try {
    const result = new Function("factorial", "return (" + cleanedExpression + ")")(factorial);
    expression = Number.isFinite(result) ? String(result) : "";
    updateDisplay();
  } catch (error) {
    display.value = "Error";
    expression = "";
  }
};

const appendToken = (token) => {
  const lastChar = expression.slice(-1);

  if (token === "C") {
    clearDisplay();
    return;
  }

  if (token === "=") {
    calculateResult();
    return;
  }

  if (token === "%") {
    applyPercent();
    return;
  }

  if (token === "⌫") {
    backspace();
    return;
  }

  if (token === "()") {
    appendParenthesis();
    return;
  }

  if (["sin", "cos", "tan", "log", "ln"].includes(token)) {
    expression += `${token}(`;
    updateDisplay();
    return;
  }

  if (token === "√") {
    expression += "√(";
    updateDisplay();
    return;
  }

  if (token === "π") {
    expression += "π";
    updateDisplay();
    return;
  }

  if (token === "mod") {
    expression += "mod";
    updateDisplay();
    return;
  }

  if (token === "^") {
    if (!expression || isOperator(lastChar) || lastChar === "(") return;
    expression += "^";
    updateDisplay();
    return;
  }

  if (isOperator(token)) {
    if (!expression) {
      if (token === "-") {
        expression = "-";
        updateDisplay();
      }
      return;
    }

    if (isOperator(lastChar) || lastChar === "(") {
      expression = expression.slice(0, -1) + token;
    } else {
      expression += token;
    }
    updateDisplay();
    return;
  }

  if (token === ".") {
    const currentNumber = expression.match(/(\d+\.?\d*)$/);
    if (!currentNumber) {
      expression += "0.";
    } else if (!currentNumber[0].includes(".")) {
      expression += ".";
    }
    updateDisplay();
    return;
  }

  expression += token;
  updateDisplay();
};

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    appendToken(button.textContent.trim());
  });
});

updateDisplay();
