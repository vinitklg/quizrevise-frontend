import fs from 'fs';
import path from 'path';

// Interface for diagram rendering options
interface DiagramRenderOptions {
  instruction: string;
  subject: string;
  questionId: string;
  width?: number;
  height?: number;
}

// Main diagram renderer function
export async function renderDiagram(options: DiagramRenderOptions): Promise<string | null> {
  const { instruction, subject, questionId } = options;
  
  // Ensure diagrams directory exists
  const diagramsDir = path.join(process.cwd(), 'public', 'diagrams');
  if (!fs.existsSync(diagramsDir)) {
    fs.mkdirSync(diagramsDir, { recursive: true });
  }
  
  try {
    // Route to appropriate renderer based on subject
    const normalizedSubject = subject.toLowerCase();
    
    if (normalizedSubject.includes('math') || normalizedSubject.includes('mathematics')) {
      return await renderMathDiagram(instruction, questionId);
    } else if (normalizedSubject.includes('physics')) {
      return await renderPhysicsDiagram(instruction, questionId);
    } else if (normalizedSubject.includes('chemistry')) {
      return await renderChemistryDiagram(instruction, questionId);
    } else if (normalizedSubject.includes('biology')) {
      return await renderBiologyDiagram(instruction, questionId);
    } else if (normalizedSubject.includes('economics')) {
      return await renderEconomicsDiagram(instruction, questionId);
    } else if (normalizedSubject.includes('commerce') || normalizedSubject.includes('business')) {
      return await renderBusinessDiagram(instruction, questionId);
    } else {
      return await renderGeneralDiagram(instruction, questionId);
    }
  } catch (error) {
    console.error('Error rendering diagram:', error);
    return null;
  }
}

// Mathematics diagram renderer using SVG
async function renderMathDiagram(instruction: string, questionId: string): Promise<string> {
  const fileName = `math_${questionId}_${Date.now()}.svg`;
  const filePath = path.join(process.cwd(), 'public', 'diagrams', fileName);
  
  // Parse instruction for common geometry shapes
  let svg = '';
  
  if (instruction.toLowerCase().includes('cyclic quadrilateral')) {
    svg = generateCyclicQuadrilateralSVG(instruction);
  } else if (instruction.toLowerCase().includes('chord') || instruction.toLowerCase().includes('subtend')) {
    svg = generateCircleSVG(instruction);
  } else if (instruction.toLowerCase().includes('triangle')) {
    svg = generateTriangleSVG(instruction);
  } else if (instruction.toLowerCase().includes('circle')) {
    svg = generateCircleSVG(instruction);
  } else if (instruction.toLowerCase().includes('rectangle') || instruction.toLowerCase().includes('square')) {
    svg = generateRectangleSVG(instruction);
  } else if (instruction.toLowerCase().includes('angle')) {
    svg = generateAngleSVG(instruction);
  } else {
    svg = generateGenericMathSVG(instruction);
  }
  
  fs.writeFileSync(filePath, svg);
  return `/diagrams/${fileName}`;
}

// Physics diagram renderer
async function renderPhysicsDiagram(instruction: string, questionId: string): Promise<string> {
  const fileName = `physics_${questionId}_${Date.now()}.svg`;
  const filePath = path.join(process.cwd(), 'public', 'diagrams', fileName);
  
  let svg = '';
  
  if (instruction.toLowerCase().includes('ray') || instruction.toLowerCase().includes('light')) {
    svg = generateRayDiagramSVG(instruction);
  } else if (instruction.toLowerCase().includes('circuit')) {
    svg = generateCircuitSVG(instruction);
  } else if (instruction.toLowerCase().includes('wave')) {
    svg = generateWaveSVG(instruction);
  } else if (instruction.toLowerCase().includes('force')) {
    svg = generateForceDiagramSVG(instruction);
  } else {
    svg = generateGenericPhysicsSVG(instruction);
  }
  
  fs.writeFileSync(filePath, svg);
  return `/diagrams/${fileName}`;
}

// Chemistry diagram renderer
async function renderChemistryDiagram(instruction: string, questionId: string): Promise<string> {
  const fileName = `chemistry_${questionId}_${Date.now()}.svg`;
  const filePath = path.join(process.cwd(), 'public', 'diagrams', fileName);
  
  let svg = '';
  
  if (instruction.toLowerCase().includes('titration') || instruction.toLowerCase().includes('apparatus')) {
    svg = generateApparatusSVG(instruction);
  } else if (instruction.toLowerCase().includes('molecule') || instruction.toLowerCase().includes('structure')) {
    svg = generateMolecularStructureSVG(instruction);
  } else if (instruction.toLowerCase().includes('reaction')) {
    svg = generateReactionSVG(instruction);
  } else {
    svg = generateGenericChemistrySVG(instruction);
  }
  
  fs.writeFileSync(filePath, svg);
  return `/diagrams/${fileName}`;
}

// Biology diagram renderer
async function renderBiologyDiagram(instruction: string, questionId: string): Promise<string> {
  const fileName = `biology_${questionId}_${Date.now()}.svg`;
  const filePath = path.join(process.cwd(), 'public', 'diagrams', fileName);
  
  let svg = '';
  
  if (instruction.toLowerCase().includes('cell') || instruction.toLowerCase().includes('organelle')) {
    svg = generateCellSVG(instruction);
  } else if (instruction.toLowerCase().includes('system') || instruction.toLowerCase().includes('organ')) {
    svg = generateAnatomySVG(instruction);
  } else if (instruction.toLowerCase().includes('cycle') || instruction.toLowerCase().includes('process')) {
    svg = generateProcessSVG(instruction);
  } else {
    svg = generateGenericBiologySVG(instruction);
  }
  
  fs.writeFileSync(filePath, svg);
  return `/diagrams/${fileName}`;
}

// Economics diagram renderer
async function renderEconomicsDiagram(instruction: string, questionId: string): Promise<string> {
  const fileName = `economics_${questionId}_${Date.now()}.svg`;
  const filePath = path.join(process.cwd(), 'public', 'diagrams', fileName);
  
  let svg = '';
  
  if (instruction.toLowerCase().includes('demand') || instruction.toLowerCase().includes('supply')) {
    svg = generateSupplyDemandSVG(instruction);
  } else if (instruction.toLowerCase().includes('graph') || instruction.toLowerCase().includes('curve')) {
    svg = generateEconomicsGraphSVG(instruction);
  } else {
    svg = generateGenericEconomicsSVG(instruction);
  }
  
  fs.writeFileSync(filePath, svg);
  return `/diagrams/${fileName}`;
}

// Business diagram renderer
async function renderBusinessDiagram(instruction: string, questionId: string): Promise<string> {
  const fileName = `business_${questionId}_${Date.now()}.svg`;
  const filePath = path.join(process.cwd(), 'public', 'diagrams', fileName);
  
  let svg = '';
  
  if (instruction.toLowerCase().includes('flowchart') || instruction.toLowerCase().includes('process')) {
    svg = generateFlowchartSVG(instruction);
  } else if (instruction.toLowerCase().includes('organization') || instruction.toLowerCase().includes('hierarchy')) {
    svg = generateOrgChartSVG(instruction);
  } else {
    svg = generateGenericBusinessSVG(instruction);
  }
  
  fs.writeFileSync(filePath, svg);
  return `/diagrams/${fileName}`;
}

// General diagram renderer for other subjects
async function renderGeneralDiagram(instruction: string, questionId: string): Promise<string> {
  const fileName = `general_${questionId}_${Date.now()}.svg`;
  const filePath = path.join(process.cwd(), 'public', 'diagrams', fileName);
  
  const svg = generateGenericSVG(instruction);
  
  fs.writeFileSync(filePath, svg);
  return `/diagrams/${fileName}`;
}

// SVG generation functions for different diagram types

function generateCyclicQuadrilateralSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .circle { fill: none; stroke: #2563eb; stroke-width: 2; }
          .quadrilateral { fill: none; stroke: #dc2626; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; }
          .point { fill: #dc2626; r: 3; }
          .angle-arc { fill: none; stroke: #059669; stroke-width: 1.5; }
        </style>
      </defs>
      
      <!-- Circle -->
      <circle cx="200" cy="150" r="80" class="circle" />
      
      <!-- Cyclic Quadrilateral ABCD -->
      <polygon points="200,70 260,120 220,230 140,200" class="quadrilateral" />
      
      <!-- Vertices -->
      <circle cx="200" cy="70" class="point" />
      <circle cx="260" cy="120" class="point" />
      <circle cx="220" cy="230" class="point" />
      <circle cx="140" cy="200" class="point" />
      
      <!-- Labels -->
      <text x="195" y="60" class="label" style="font-weight: bold;">A</text>
      <text x="270" y="115" class="label" style="font-weight: bold;">B</text>
      <text x="225" y="245" class="label" style="font-weight: bold;">C</text>
      <text x="125" y="195" class="label" style="font-weight: bold;">D</text>
      
      <!-- Angle markings -->
      <path d="M 250,125 A 10,10 0 0,1 255,135" class="angle-arc" />
      <text x="255" y="130" class="label" style="font-size: 12px;">110°</text>
      
      <path d="M 150,195 A 10,10 0 0,1 145,185" class="angle-arc" />
      <text x="145" y="180" class="label" style="font-size: 12px;">70°</text>
      
      <!-- Center point -->
      <circle cx="200" cy="150" r="2" fill="#666" />
      <text x="205" y="155" class="label" style="font-size: 12px;">O</text>
      
      <!-- Instruction text -->
      <text x="10" y="20" class="label" style="font-weight: bold; font-size: 12px;">${instruction}</text>
    </svg>
  `;
}

function generateTriangleSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .triangle { fill: none; stroke: #2563eb; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; }
          .point { fill: #dc2626; r: 3; }
        </style>
      </defs>
      
      <!-- Triangle ABC -->
      <polygon points="50,250 200,50 350,250" class="triangle" />
      
      <!-- Points -->
      <circle cx="50" cy="250" class="point" />
      <circle cx="200" cy="50" class="point" />
      <circle cx="350" cy="250" class="point" />
      
      <!-- Labels -->
      <text x="40" y="270" class="label">A</text>
      <text x="190" y="40" class="label">B</text>
      <text x="360" y="270" class="label">C</text>
      
      <!-- Sides -->
      <text x="120" y="160" class="label">AB</text>
      <text x="280" y="160" class="label">BC</text>
      <text x="200" y="280" class="label">AC</text>
      
      <!-- Instruction text -->
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
    </svg>
  `;
}

function generateCircleSVG(instruction: string): string {
  // Enhanced parsing for board-level accuracy
  const lowerInstruction = instruction.toLowerCase();
  
  // Extract chord information with better pattern matching
  const chordMatch = lowerInstruction.match(/chord\s+([a-z]{2,3})/);
  const chordName = chordMatch ? chordMatch[1].toUpperCase() : 'PQ';
  
  // Extract all angle measurements
  const angleMatches = instruction.match(/(\d+)°/g);
  const angleValue = angleMatches && angleMatches.length > 0 ? angleMatches[0].replace('°', '') : '60';
  
  // Extract point names with better detection
  const pointMatches = instruction.match(/point\s+([a-z])/gi);
  const mainPoint = pointMatches && pointMatches.length > 0 ? pointMatches[0].replace(/point\s+/i, '').toUpperCase() : 'P';
  
  // Detect angle types
  const isInscribedAngle = lowerInstruction.includes('inscribed') || lowerInstruction.includes('circumference');
  const isCentralAngle = lowerInstruction.includes('central') || lowerInstruction.includes('center');
  
  // Detect arc information
  const onMajorArc = lowerInstruction.includes('major arc');
  const onMinorArc = lowerInstruction.includes('minor arc');
  
  // Calculate positions based on geometric constraints
  const centerX = 200, centerY = 150, radius = 80;
  
  // Chord endpoints (PQ)
  const chordP = { x: 140, y: 110 };
  const chordQ = { x: 260, y: 190 };
  
  // Point on arc (major or minor)
  const arcPoint = onMajorArc ? { x: 200, y: 70 } : { x: 200, y: 230 };
  
  return `
    <svg width="450" height="350" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .circle { fill: none; stroke: #2563eb; stroke-width: 2; }
          .chord { stroke: #dc2626; stroke-width: 2.5; }
          .radius { stroke: #059669; stroke-width: 1.5; stroke-dasharray: 3,2; }
          .inscribed-angle { fill: none; stroke: #f59e0b; stroke-width: 2.5; }
          .central-angle { fill: none; stroke: #8b5cf6; stroke-width: 2.5; }
          .label { font-family: 'Arial', sans-serif; font-size: 14px; fill: #1f2937; font-weight: bold; }
          .angle-label { font-family: 'Arial', sans-serif; font-size: 12px; fill: #dc2626; font-weight: bold; }
          .point { fill: #dc2626; }
          .center-point { fill: #2563eb; }
          .arc-indicator { stroke: #10b981; stroke-width: 3; fill: none; stroke-dasharray: 5,3; }
          .instruction { font-family: 'Arial', sans-serif; font-size: 10px; fill: #6b7280; }
        </style>
      </defs>
      
      <!-- Circle with center O -->
      <circle cx="${centerX}" cy="${centerY}" r="${radius}" class="circle" />
      
      <!-- Major/Minor arc indicator -->
      ${onMajorArc ? `
      <path d="M ${chordP.x},${chordP.y} A ${radius},${radius} 0 1,0 ${chordQ.x},${chordQ.y}" class="arc-indicator" />
      ` : ''}
      
      <!-- Chord ${chordName} -->
      <line x1="${chordP.x}" y1="${chordP.y}" x2="${chordQ.x}" y2="${chordQ.y}" class="chord" />
      
      <!-- Point ${mainPoint} on circumference -->
      <circle cx="${arcPoint.x}" cy="${arcPoint.y}" r="4" class="point" />
      
      <!-- Center point O -->
      <circle cx="${centerX}" cy="${centerY}" r="3" class="center-point" />
      
      <!-- Chord endpoints -->
      <circle cx="${chordP.x}" cy="${chordP.y}" r="3" class="point" />
      <circle cx="${chordQ.x}" cy="${chordQ.y}" r="3" class="point" />
      
      <!-- Inscribed angle at point ${mainPoint} -->
      <path d="M ${arcPoint.x-25},${arcPoint.y+15} A 25,25 0 0,1 ${arcPoint.x+25},${arcPoint.y+15}" class="inscribed-angle" />
      <text x="${arcPoint.x-15}" y="${arcPoint.y+35}" class="angle-label">∠${mainPoint}${chordName[0]}${chordName[1]} = ${angleValue}°</text>
      
      <!-- Central angle at center O (always show for center/chord problems) -->
      <path d="M ${centerX-35},${centerY-15} A 35,35 0 0,1 ${centerX+35},${centerY+15}" class="central-angle" />
      
      <!-- Radii OA and OB -->
      <line x1="${centerX}" y1="${centerY}" x2="${chordP.x}" y2="${chordP.y}" class="radius" />
      <line x1="${centerX}" y1="${centerY}" x2="${chordQ.x}" y2="${chordQ.y}" class="radius" />
      
      <!-- Radius labels -->
      <text x="${centerX-30}" y="${centerY-20}" class="label" style="font-size: 10px; fill: #059669;">O${chordName[0]}</text>
      <text x="${centerX+20}" y="${centerY+25}" class="label" style="font-size: 10px; fill: #059669;">O${chordName[1]}</text>
      
      <!-- Central angle label and measurement -->
      <text x="${centerX-25}" y="${centerY+60}" class="angle-label">∠${chordName[0]}O${chordName[1]}</text>
      <text x="${centerX-20}" y="${centerY-25}" class="angle-label" style="font-size: 12px; fill: #8b5cf6; font-weight: bold;">${parseInt(angleValue) * 2}°</text>
      
      <!-- Point labels with precise positioning -->
      <text x="${centerX+8}" y="${centerY-8}" class="label">O</text>
      <text x="${chordP.x-15}" y="${chordP.y-8}" class="label">${chordName[0]}</text>
      <text x="${chordQ.x+8}" y="${chordQ.y+15}" class="label">${chordName[1]}</text>
      <text x="${arcPoint.x-8}" y="${arcPoint.y-8}" class="label">${mainPoint}</text>
      
      <!-- Angle type indicator -->
      ${isInscribedAngle ? `
      <text x="10" y="280" class="angle-label" style="font-size: 10px; fill: #f59e0b;">Inscribed Angle</text>
      ` : ''}
      ${isCentralAngle ? `
      <text x="10" y="270" class="angle-label" style="font-size: 10px; fill: #8b5cf6;">Central Angle</text>
      ` : ''}
      
      <!-- Complete instruction text -->
      <text x="10" y="15" class="instruction">${instruction}</text>
      
      <!-- Legend -->
      <text x="10" y="320" class="instruction" style="font-weight: bold;">Legend:</text>
      <text x="10" y="335" class="instruction">• Inscribed angle (orange): ${angleValue}°</text>
      <text x="200" y="335" class="instruction">• Central angle (purple): ${parseInt(angleValue) * 2}°</text>
    </svg>
  `;
}

function generateRayDiagramSVG(instruction: string): string {
  return `
    <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .ray { stroke: #dc2626; stroke-width: 2; fill: none; }
          .lens { stroke: #2563eb; stroke-width: 3; fill: none; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
          .axis { stroke: #6b7280; stroke-width: 1; stroke-dasharray: 5,5; }
        </style>
      </defs>
      
      <!-- Principal axis -->
      <line x1="50" y1="150" x2="450" y2="150" class="axis" />
      
      <!-- Lens -->
      <ellipse cx="250" cy="150" rx="10" ry="80" class="lens" />
      
      <!-- Incident rays -->
      <line x1="100" y1="100" x2="250" y2="130" class="ray" />
      <line x1="100" y1="100" x2="250" y2="150" class="ray" />
      
      <!-- Refracted rays -->
      <line x1="250" y1="130" x2="400" y2="180" class="ray" />
      <line x1="250" y1="150" x2="400" y2="150" class="ray" />
      
      <!-- Labels -->
      <text x="90" y="90" class="label">Object</text>
      <text x="240" y="240" class="label">Lens</text>
      <text x="410" y="170" class="label">Image</text>
      
      <!-- Instruction text -->
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
    </svg>
  `;
}

function generateCircuitSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .wire { stroke: #000; stroke-width: 2; fill: none; }
          .resistor { stroke: #000; stroke-width: 2; fill: none; }
          .battery { stroke: #000; stroke-width: 2; fill: none; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
        </style>
      </defs>
      
      <!-- Circuit wires -->
      <path d="M 100 100 L 300 100 L 300 200 L 100 200 Z" class="wire" />
      
      <!-- Battery -->
      <line x1="80" y1="100" x2="100" y2="100" class="battery" />
      <line x1="90" y1="90" x2="90" y2="110" class="battery" stroke-width="4" />
      <line x1="95" y1="95" x2="95" y2="105" class="battery" stroke-width="2" />
      
      <!-- Resistor -->
      <rect x="190" y="95" width="20" height="10" class="resistor" />
      <path d="M 180 100 L 190 100 M 210 100 L 220 100" class="resistor" />
      
      <!-- Labels -->
      <text x="70" y="85" class="label">Battery</text>
      <text x="185" y="85" class="label">R</text>
      
      <!-- Instruction text -->
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
    </svg>
  `;
}

function generateApparatusSVG(instruction: string): string {
  return `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .apparatus { stroke: #000; stroke-width: 2; fill: none; }
          .liquid { fill: #3b82f6; opacity: 0.7; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
        </style>
      </defs>
      
      <!-- Burette -->
      <rect x="100" y="50" width="15" height="200" class="apparatus" />
      <rect x="95" y="45" width="25" height="10" class="apparatus" />
      
      <!-- Conical flask -->
      <ellipse cx="250" cy="350" rx="50" ry="15" class="apparatus" />
      <path d="M 200 350 L 230 280 L 270 280 L 300 350" class="apparatus" />
      
      <!-- Liquid in flask -->
      <ellipse cx="250" cy="340" rx="40" ry="10" class="liquid" />
      
      <!-- Stand -->
      <line x1="80" y1="50" x2="80" y2="370" class="apparatus" stroke-width="3" />
      <line x1="70" y1="370" x2="90" y2="370" class="apparatus" stroke-width="3" />
      
      <!-- Labels -->
      <text x="120" y="150" class="label">Burette</text>
      <text x="280" y="320" class="label">Conical Flask</text>
      <text x="50" y="300" class="label">Stand</text>
      
      <!-- Instruction text -->
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
    </svg>
  `;
}

function generateCellSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .cell-wall { stroke: #16a34a; stroke-width: 3; fill: none; }
          .organelle { stroke: #dc2626; stroke-width: 2; fill: #fef2f2; }
          .nucleus { stroke: #7c3aed; stroke-width: 2; fill: #f3e8ff; }
          .label { font-family: Arial, sans-serif; font-size: 11px; fill: #1f2937; }
        </style>
      </defs>
      
      <!-- Cell membrane -->
      <ellipse cx="200" cy="150" rx="180" ry="120" class="cell-wall" />
      
      <!-- Nucleus -->
      <ellipse cx="200" cy="150" rx="50" ry="35" class="nucleus" />
      
      <!-- Mitochondria -->
      <ellipse cx="120" cy="100" rx="20" ry="12" class="organelle" />
      <ellipse cx="280" cy="180" rx="18" ry="10" class="organelle" />
      
      <!-- Endoplasmic reticulum -->
      <path d="M 100 180 Q 150 200 200 180 Q 250 160 300 180" class="organelle" />
      
      <!-- Labels -->
      <text x="190" y="140" class="label">Nucleus</text>
      <text x="100" y="85" class="label">Mitochondria</text>
      <text x="250" y="200" class="label">ER</text>
      
      <!-- Instruction text -->
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
    </svg>
  `;
}

function generateSupplyDemandSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .axis { stroke: #000; stroke-width: 2; }
          .supply { stroke: #16a34a; stroke-width: 3; fill: none; }
          .demand { stroke: #dc2626; stroke-width: 3; fill: none; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
        </style>
      </defs>
      
      <!-- Axes -->
      <line x1="50" y1="250" x2="350" y2="250" class="axis" />
      <line x1="50" y1="250" x2="50" y2="50" class="axis" />
      
      <!-- Supply curve -->
      <path d="M 80 220 Q 150 180 250 120 Q 300 100 320 80" class="supply" />
      
      <!-- Demand curve -->
      <path d="M 80 80 Q 150 120 250 180 Q 300 200 320 220" class="demand" />
      
      <!-- Labels -->
      <text x="360" y="255" class="label">Quantity</text>
      <text x="30" y="45" class="label">Price</text>
      <text x="270" y="100" class="label">Supply</text>
      <text x="270" y="230" class="label">Demand</text>
      
      <!-- Instruction text -->
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
    </svg>
  `;
}

function generateFlowchartSVG(instruction: string): string {
  return `
    <svg width="400" height="350" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .box { stroke: #2563eb; stroke-width: 2; fill: #eff6ff; }
          .arrow { stroke: #000; stroke-width: 2; marker-end: url(#arrowhead); }
          .label { font-family: Arial, sans-serif; font-size: 11px; fill: #1f2937; text-anchor: middle; }
        </style>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
        </marker>
      </defs>
      
      <!-- Process boxes -->
      <rect x="150" y="60" width="100" height="40" class="box" rx="5" />
      <rect x="150" y="140" width="100" height="40" class="box" rx="5" />
      <rect x="150" y="220" width="100" height="40" class="box" rx="5" />
      
      <!-- Arrows -->
      <line x1="200" y1="100" x2="200" y2="140" class="arrow" />
      <line x1="200" y1="180" x2="200" y2="220" class="arrow" />
      
      <!-- Labels -->
      <text x="200" y="85" class="label">Start Process</text>
      <text x="200" y="165" class="label">Execute Task</text>
      <text x="200" y="245" class="label">End Process</text>
      
      <!-- Instruction text -->
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
    </svg>
  `;
}

// Generic fallback functions
function generateRectangleSVG(instruction: string): string {
  return generateGenericMathSVG(instruction);
}

function generateAngleSVG(instruction: string): string {
  return generateGenericMathSVG(instruction);
}

function generateGenericMathSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .shape { fill: none; stroke: #2563eb; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; }
        </style>
      </defs>
      
      <rect x="100" y="100" width="200" height="120" class="shape" />
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
      <text x="200" y="170" class="label" text-anchor="middle">Mathematical Figure</text>
    </svg>
  `;
}

function generateWaveSVG(instruction: string): string {
  return generateGenericPhysicsSVG(instruction);
}

function generateForceDiagramSVG(instruction: string): string {
  return generateGenericPhysicsSVG(instruction);
}

function generateGenericPhysicsSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .diagram { stroke: #dc2626; stroke-width: 2; fill: none; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; }
        </style>
      </defs>
      
      <rect x="100" y="100" width="200" height="120" class="diagram" />
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
      <text x="200" y="170" class="label" text-anchor="middle">Physics Diagram</text>
    </svg>
  `;
}

function generateMolecularStructureSVG(instruction: string): string {
  return generateGenericChemistrySVG(instruction);
}

function generateReactionSVG(instruction: string): string {
  return generateGenericChemistrySVG(instruction);
}

function generateGenericChemistrySVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .molecule { stroke: #16a34a; stroke-width: 2; fill: #f0fdf4; }
          .bond { stroke: #000; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; }
        </style>
      </defs>
      
      <circle cx="150" cy="150" r="20" class="molecule" />
      <circle cx="250" cy="150" r="20" class="molecule" />
      <line x1="170" y1="150" x2="230" y2="150" class="bond" />
      
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
      <text x="200" y="250" class="label" text-anchor="middle">Chemical Structure</text>
    </svg>
  `;
}

function generateAnatomySVG(instruction: string): string {
  return generateGenericBiologySVG(instruction);
}

function generateProcessSVG(instruction: string): string {
  return generateGenericBiologySVG(instruction);
}

function generateGenericBiologySVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .organ { stroke: #7c3aed; stroke-width: 2; fill: #f3e8ff; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; }
        </style>
      </defs>
      
      <ellipse cx="200" cy="150" rx="100" ry="60" class="organ" />
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
      <text x="200" y="160" class="label" text-anchor="middle">Biological Structure</text>
    </svg>
  `;
}

function generateEconomicsGraphSVG(instruction: string): string {
  return generateGenericEconomicsSVG(instruction);
}

function generateGenericEconomicsSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .axis { stroke: #000; stroke-width: 2; }
          .curve { stroke: #2563eb; stroke-width: 3; fill: none; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; }
        </style>
      </defs>
      
      <line x1="50" y1="250" x2="350" y2="250" class="axis" />
      <line x1="50" y1="250" x2="50" y2="50" class="axis" />
      <path d="M 80 220 Q 200 150 320 80" class="curve" />
      
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
      <text x="200" y="280" class="label" text-anchor="middle">Economics Graph</text>
    </svg>
  `;
}

function generateOrgChartSVG(instruction: string): string {
  return generateGenericBusinessSVG(instruction);
}

function generateGenericBusinessSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .box { stroke: #2563eb; stroke-width: 2; fill: #eff6ff; }
          .line { stroke: #000; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; text-anchor: middle; }
        </style>
      </defs>
      
      <rect x="150" y="80" width="100" height="40" class="box" rx="5" />
      <rect x="100" y="160" width="80" height="40" class="box" rx="5" />
      <rect x="220" y="160" width="80" height="40" class="box" rx="5" />
      
      <line x1="200" y1="120" x2="140" y2="160" class="line" />
      <line x1="200" y1="120" x2="260" y2="160" class="line" />
      
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
      <text x="200" y="105" class="label">Management</text>
      <text x="140" y="185" class="label">Dept A</text>
      <text x="260" y="185" class="label">Dept B</text>
    </svg>
  `;
}

function generateGenericSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .diagram { stroke: #6b7280; stroke-width: 2; fill: #f9fafb; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; }
        </style>
      </defs>
      
      <rect x="100" y="100" width="200" height="120" class="diagram" rx="10" />
      <text x="50" y="20" class="label" style="font-weight: bold;">${instruction}</text>
      <text x="200" y="170" class="label" text-anchor="middle">Diagram</text>
    </svg>
  `;
}