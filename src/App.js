import { useReducer } from "react";
import { useEffect } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
  FREE: "free",
};

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) {
    return "";
  }
  let comp = "";
  switch (operation) {
    case "+":
      comp = prev + curr;
      break;
    case "−":
      comp = prev - curr;
      break;
    case "x":
      comp = prev * curr;
      break;
    case "÷":
      comp = prev / curr;
      break;
    default:
      break;
  }
  return comp.toString();
}

const INTERGER_FORMATTER = new Intl.NumberFormat("en", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [interger, decimal] = operand.split(".");
  if (decimal == null) return INTERGER_FORMATTER.format(interger);
  return `${INTERGER_FORMATTER.format(interger)}.${decimal}`;
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }

      if (
        payload.digit === "." &&
        state.currentOperand &&
        state.currentOperand.includes(".")
      ) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
          overwrite: false,
        };
      }
      if (state.currentOperand == null && state.previousOperand != null) {
        return {
          ...state,
          currentOperand: state.previousOperand,
          previousOperand: null,
          operation: null,
        };
      }
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    default:
      break;
  }
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log("Key pressed:", event.key);

      const key = event.key;
      const code = event.code;

      if (/[0-9]/.test(key)) {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: key } });
      } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        if (key === "*") {
          dispatch({
            type: ACTIONS.CHOOSE_OPERATION,
            payload: { operation: "x" },
          });
        } else if (key === "/") {
          dispatch({
            type: ACTIONS.CHOOSE_OPERATION,
            payload: { operation: "÷" },
          });
        } else {
          dispatch({
            type: ACTIONS.CHOOSE_OPERATION,
            payload: { operation: key },
          });
        }
      } else if (code === "Enter" || key === "Enter") {
        dispatch({ type: ACTIONS.EVALUATE });
      } else if (key === "Escape") {
        dispatch({ type: ACTIONS.CLEAR });
      } else if (key === "Backspace") {
        dispatch({ type: ACTIONS.DELETE_DIGIT });
      } else if (key === ".") {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: key } });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  return (
    <div className="calculator-container">
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className="current-operand">
            {" "}
            {formatOperand(currentOperand)}{" "}
          </div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
          DEL
        </button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="x" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="−" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default App;
