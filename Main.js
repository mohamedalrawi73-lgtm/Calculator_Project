const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
let expression = "";

const updateDisplay = () => {
  display.value = expression;
};

const appendToken = (token) => {
  const lastChar = expression.slice(-1);
  const operators = ["+", "-", "*", "/"];

  if (operators.includes(token)) {
    if (!expression) return;
    if (operators.includes(lastChar)) {
      expression = expression.slice(0, -1) + token;
      updateDisplay();
      return;
    }
  }

  expression += token;
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

const clearDisplay = () => {
  expression = "";
  updateDisplay();
};

const calculateResult = () => {
  if (!expression) return;

  const cleanedExpression = expression.replace(/%/g, "/100");

  try {
    const result = Function("'use strict'; return (" + cleanedExpression + ")")();
    expression = Number.isFinite(result) ? String(result) : "";
    updateDisplay();
  } catch (error) {
    display.value = "Error";
    expression = "";
  }
};

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent.trim();

    if (value === "C") {
      clearDisplay();
      return;
    }

    if (value === "=") {
      calculateResult();
      return;
    }

    if (value === "%") {
      applyPercent();
      return;
    }

    appendToken(value);
  });
});

updateDisplay();
