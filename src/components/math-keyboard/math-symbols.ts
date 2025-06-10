// Math symbols with their LaTeX equivalents organized by category
export interface MathSymbol {
  symbol: string;
  latex: string;
  category: 'basic' | 'sets' | 'logic' | 'calculus';
  tooltip?: string;
}

const mathSymbols: MathSymbol[] = [
  // Row 1: Basic operations
  { symbol: '+', latex: '+', category: 'basic' },
  { symbol: '-', latex: '-', category: 'basic' },
  { symbol: '±', latex: '\\pm', category: 'basic' },
  { symbol: '*', latex: '\\cdot', category: 'basic' },
  { symbol: '/', latex: '\\div', category: 'basic' },
  { symbol: '%', latex: '\\%', category: 'basic' },
  { symbol: '=', latex: '=', category: 'basic' },
  { symbol: '≠', latex: '\\neq', category: 'basic' },
  { symbol: '(', latex: '(', category: 'basic' },
  { symbol: ')', latex: ')', category: 'basic' },
  { symbol: '<', latex: '<', category: 'basic' },
  { symbol: '>', latex: '>', category: 'basic' },
  { symbol: '≤', latex: '\\leq', category: 'basic' },
  { symbol: '≥', latex: '\\geq', category: 'basic' },
  { symbol: '√', latex: '\\sqrt{}', category: 'basic' },
  { symbol: '∛', latex: '\\sqrt[3]{}', category: 'basic' },
  { symbol: '^', latex: '^{}', category: 'basic' },
  { symbol: '!', latex: '!', category: 'basic' },

  // Row 2: Set theory
  { symbol: '∈', latex: '\\in', category: 'sets' },
  { symbol: '∉', latex: '\\notin', category: 'sets' },
  { symbol: '⊂', latex: '\\subset', category: 'sets' },
  { symbol: '⊄', latex: '\\not\\subset', category: 'sets' },
  { symbol: '⊆', latex: '\\subseteq', category: 'sets' },
  { symbol: '⊈', latex: '\\not\\subseteq', category: 'sets' },
  { symbol: '⊃', latex: '\\supset', category: 'sets' },
  { symbol: '⊇', latex: '\\supseteq', category: 'sets' },
  { symbol: '∅', latex: '\\emptyset', category: 'sets' },
  { symbol: 'U', latex: '\\mathbb{U}', category: 'sets' },
  { symbol: '∩', latex: '\\cap', category: 'sets' },
  { symbol: '∪', latex: '\\cup', category: 'sets' },
  { symbol: '⊕', latex: '\\oplus', category: 'sets' },

  // Row 3: Logic
  { symbol: '⇒', latex: '\\Rightarrow', category: 'logic' },
  { symbol: '⇔', latex: '\\Leftrightarrow', category: 'logic' },
  { symbol: '∧', latex: '\\land', category: 'logic' },
  { symbol: '∨', latex: '\\lor', category: 'logic' },
  { symbol: '¬', latex: '\\neg', category: 'logic' },
  { symbol: '∀', latex: '\\forall', category: 'logic' },
  { symbol: '∃', latex: '\\exists', category: 'logic' },
  { symbol: '∴', latex: '\\therefore', category: 'logic' },
  { symbol: '∵', latex: '\\because', category: 'logic' },

  // Row 4: Calculus and others
  { symbol: 'f(x)', latex: 'f(x)', category: 'calculus' },
  { symbol: 'Δ', latex: '\\Delta', category: 'calculus' },
  { symbol: '∝', latex: '\\propto', category: 'calculus' },
  { symbol: '∑', latex: '\\sum', category: 'calculus' },
  { symbol: '∏', latex: '\\prod', category: 'calculus' },
  { symbol: 'd', latex: 'd', category: 'calculus' },
  { symbol: '∫', latex: '\\int', category: 'calculus' },
  { symbol: '∂', latex: '\\partial', category: 'calculus' },
  { symbol: '∇', latex: '\\nabla', category: 'calculus' },
  { symbol: 'lim', latex: '\\lim', category: 'calculus' },
  { symbol: '∞', latex: '\\infty', category: 'calculus' },
  { symbol: '$', latex: '$', category: 'calculus', tooltip: '插入行内公式' },
];

export default mathSymbols;
