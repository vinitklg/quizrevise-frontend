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
  
  // Parse instruction based on CBSE/ICSE Class 9-10 curriculum topics
  let svg = '';
  const lower = instruction.toLowerCase();
  
  // GEOMETRY - Class 9-10 Core Topics
  if (lower.includes('cyclic quadrilateral') || lower.includes('exterior angle')) {
    svg = generateCyclicQuadrilateralSVG(instruction);
  } else if (lower.includes('parallelogram') || lower.includes('rhombus')) {
    svg = generateParallelogramSVG(instruction);
  } else if (lower.includes('congruent') || lower.includes('congruency')) {
    svg = generateCongruentTrianglesSVG(instruction);
  } else if (lower.includes('midpoint theorem') || lower.includes('mid-point')) {
    svg = generateMidpointTheoremSVG(instruction);
  } else if (lower.includes('pythagoras') || lower.includes('right triangle')) {
    svg = generatePythagorasTheoremSVG(instruction);
  } else if (lower.includes('chord') && lower.includes('circle')) {
    svg = generateChordPropertiesSVG(instruction);
  } else if (lower.includes('triangle')) {
    svg = generateTriangleSVG(instruction);
  } else if (lower.includes('circle')) {
    svg = generateCircleSVG(instruction);
  } else if (lower.includes('quadrilateral')) {
    svg = generateQuadrilateralSVG(instruction);
  
  // MENSURATION - 3D Solids
  } else if (lower.includes('cylinder')) {
    svg = generateCylinderSVG(instruction);
  } else if (lower.includes('cube') || lower.includes('cuboid')) {
    svg = generateCuboidSVG(instruction);
  
  // COORDINATE GEOMETRY
  } else if (lower.includes('coordinate') || lower.includes('cartesian')) {
    svg = generateCoordinateGeometrySVG(instruction);
  } else if (lower.includes('linear equation') || lower.includes('graph')) {
    svg = generateLinearEquationSVG(instruction);
  
  // ALGEBRA & NUMBER SYSTEMS
  } else if (lower.includes('number line') || lower.includes('rational')) {
    svg = generateNumberLineSVG(instruction);
  } else if (lower.includes('polynomial') || lower.includes('factorization')) {
    svg = generatePolynomialSVG(instruction);
  
  // STATISTICS
  } else if (lower.includes('bar graph') || lower.includes('histogram')) {
    svg = generateBarGraphSVG(instruction);
  } else if (lower.includes('pie chart')) {
    svg = generatePieChartSVG(instruction);
  
  // CONSTRUCTIONS
  } else if (lower.includes('construction') || lower.includes('compass')) {
    svg = generateConstructionSVG(instruction);
  } else if (lower.includes('hexagon')) {
    svg = generateHexagonSVG(instruction);
  
  // TRIGONOMETRY
  } else if (lower.includes('trigonometry') || lower.includes('height and distance')) {
    svg = generateTrigonometrySVG(instruction);
  
  // GENERIC FALLBACKS
  } else if (lower.includes('rectangle') || lower.includes('square')) {
    svg = generateRectangleSVG(instruction);
  } else if (lower.includes('angle')) {
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
  const lower = instruction.toLowerCase();
  
  // Check for specific economics graph types and generate unique diagrams
  if (lower.includes('production possibility') || lower.includes('ppc') || lower.includes('ppf')) {
    svg = generatePPCGraphSVG(instruction);
  } else if (lower.includes('demand') && lower.includes('supply')) {
    svg = generateDemandSupplyGraphSVG(instruction);
  } else if (lower.includes('demand') && (lower.includes('shift') || lower.includes('increase') || lower.includes('decrease'))) {
    svg = generateDemandSupplyGraphSVG(instruction);
  } else if (lower.includes('supply') && (lower.includes('shift') || lower.includes('increase') || lower.includes('decrease'))) {
    svg = generateDemandSupplyGraphSVG(instruction);
  } else if (lower.includes('price floor') || lower.includes('price ceiling')) {
    svg = generateDemandSupplyGraphSVG(instruction);
  } else if (lower.includes('elasticity')) {
    svg = generateDemandSupplyGraphSVG(instruction);
  } else if (lower.includes('market') || lower.includes('equilibrium')) {
    svg = generateDemandSupplyGraphSVG(instruction);
  } else if (lower.includes('cost') || lower.includes('revenue') || lower.includes('profit')) {
    svg = generateSupplyDemandSVG(instruction);
  } else {
    // Generate a basic economic graph for other economics topics
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
  // Extract quadrilateral name (PQRS, ABCD, EFGH, etc.)
  const quadMatch = instruction.match(/quadrilateral\s+([A-Z]{4})/i);
  const quadName = quadMatch ? quadMatch[1].toUpperCase() : 'ABCD';
  
  // Extract angle values
  const angleMatches = instruction.match(/(\d+)°/g);
  const exteriorAngle = angleMatches ? angleMatches[0].replace('°', '') : '130';
  
  // Extract vertex where exterior angle is located
  const exteriorVertexMatch = instruction.match(/exterior angle at\s+([A-Z])/i);
  const exteriorVertex = exteriorVertexMatch ? exteriorVertexMatch[1].toUpperCase() : quadName[1];
  
  // Map vertices to positions
  const vertices = {
    [quadName[0]]: { x: 200, y: 70, labelX: 195, labelY: 60 },
    [quadName[1]]: { x: 260, y: 120, labelX: 270, labelY: 115 },
    [quadName[2]]: { x: 220, y: 230, labelX: 225, labelY: 245 },
    [quadName[3]]: { x: 140, y: 200, labelX: 125, labelY: 195 }
  };
  
  // Find opposite vertex for exterior angle property
  const vertexIndex = quadName.indexOf(exteriorVertex);
  const oppositeVertex = quadName[(vertexIndex + 2) % 4];
  
  return `
    <svg width="450" height="350" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .circle { fill: none; stroke: #2563eb; stroke-width: 2; }
          .quadrilateral { fill: none; stroke: #dc2626; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; font-weight: bold; }
          .point { fill: #dc2626; }
          .angle-arc { fill: none; stroke: #f59e0b; stroke-width: 2; }
          .exterior-angle { fill: none; stroke: #8b5cf6; stroke-width: 2; }
          .instruction { font-family: Arial, sans-serif; font-size: 10px; fill: #6b7280; }
        </style>
      </defs>
      
      <!-- Circle -->
      <circle cx="200" cy="150" r="80" class="circle" />
      
      <!-- Cyclic Quadrilateral ${quadName} -->
      <polygon points="${vertices[quadName[0]].x},${vertices[quadName[0]].y} ${vertices[quadName[1]].x},${vertices[quadName[1]].y} ${vertices[quadName[2]].x},${vertices[quadName[2]].y} ${vertices[quadName[3]].x},${vertices[quadName[3]].y}" class="quadrilateral" />
      
      <!-- Vertices -->
      ${Object.entries(vertices).map(([vertex, pos]) => 
        `<circle cx="${pos.x}" cy="${pos.y}" r="4" class="point" />`
      ).join('\n      ')}
      
      <!-- Vertex Labels -->
      ${Object.entries(vertices).map(([vertex, pos]) => 
        `<text x="${pos.labelX}" y="${pos.labelY}" class="label">${vertex}</text>`
      ).join('\n      ')}
      
      <!-- Exterior angle at ${exteriorVertex} -->
      <path d="M ${vertices[exteriorVertex].x - 25},${vertices[exteriorVertex].y + 15} A 25,25 0 0,1 ${vertices[exteriorVertex].x + 25},${vertices[exteriorVertex].y + 15}" class="exterior-angle" />
      <text x="${vertices[exteriorVertex].x - 15}" y="${vertices[exteriorVertex].y + 35}" class="label" style="font-size: 12px; fill: #8b5cf6;">Exterior ∠${exteriorVertex} = ${exteriorAngle}°</text>
      
      <!-- Opposite interior angle at ${oppositeVertex} -->
      <path d="M ${vertices[oppositeVertex].x - 20},${vertices[oppositeVertex].y - 10} A 20,20 0 0,1 ${vertices[oppositeVertex].x + 20},${vertices[oppositeVertex].y - 10}" class="angle-arc" />
      <text x="${vertices[oppositeVertex].x - 15}" y="${vertices[oppositeVertex].y - 25}" class="label" style="font-size: 12px; fill: #f59e0b;">∠${oppositeVertex} = ${exteriorAngle}°</text>
      
      <!-- Center point -->
      <circle cx="200" cy="150" r="2" fill="#666" />
      <text x="205" y="145" class="label" style="font-size: 12px;">O</text>
      
      <!-- Complete instruction text -->
      <text x="10" y="15" class="instruction">${instruction}</text>
      
      <!-- Property explanation -->
      <text x="10" y="320" class="instruction" style="font-weight: bold;">Property: Exterior angle = Opposite interior angle</text>
      <text x="10" y="335" class="instruction">Exterior ∠${exteriorVertex} = Interior ∠${oppositeVertex} = ${exteriorAngle}°</text>
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
  // Parse instruction for specific elements
  const centerX = 250, centerY = 200, radius = 100;
  
  // Extract chord letters (looking for two capital letters)
  const chordMatch = instruction.match(/chord\s+([A-Z]{2})/);
  const chord = chordMatch ? chordMatch[1] : 'AB';
  
  // Extract angle value
  const angleMatch = instruction.match(/(\d+)°/);
  const angle = angleMatch ? parseInt(angleMatch[1]) : 70;
  
  // Extract point letter (single capital letter after "point")
  const pointMatch = instruction.match(/point\s+([A-Z])/);
  const point = pointMatch ? pointMatch[1] : 'C';
  
  // Determine angle types based on keywords
  const isCentralAngle = instruction.includes('center') || instruction.includes('central');
  const hasInscribedAngle = instruction.includes('circumference') || instruction.includes('remaining part');
  
  // Calculate chord endpoints based on central angle
  const angleRad = (angle * Math.PI) / 180;
  const chordAx = centerX - radius * Math.cos(angleRad / 2);
  const chordAy = centerY - radius * Math.sin(angleRad / 2);
  const chordBx = centerX + radius * Math.cos(angleRad / 2);
  const chordBy = centerY - radius * Math.sin(angleRad / 2);
  
  // Point on circumference for inscribed angle
  const pointCx = centerX;
  const pointCy = centerY + radius * 0.8;
  
  return `
    <svg width="500" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .circle { fill: none; stroke: #1e40af; stroke-width: 3; }
          .chord { stroke: #dc2626; stroke-width: 3; }
          .radius { stroke: #059669; stroke-width: 2; stroke-dasharray: 4,2; }
          .central-angle { fill: rgba(139, 92, 246, 0.1); stroke: #8b5cf6; stroke-width: 2; }
          .inscribed-angle { fill: rgba(245, 158, 11, 0.1); stroke: #f59e0b; stroke-width: 2; }
          .point { fill: #dc2626; stroke: #dc2626; stroke-width: 2; }
          .center-point { fill: #1e40af; stroke: #1e40af; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 16px; fill: #1f2937; font-weight: bold; }
          .angle-label { font-family: Arial, sans-serif; font-size: 14px; fill: #dc2626; font-weight: bold; }
          .title { font-family: Arial, sans-serif; font-size: 12px; fill: #6b7280; }
        </style>
      </defs>
      
      <!-- Main circle -->
      <circle cx="${centerX}" cy="${centerY}" r="${radius}" class="circle" />
      
      <!-- Chord -->
      <line x1="${chordAx}" y1="${chordAy}" x2="${chordBx}" y2="${chordBy}" class="chord" />
      
      <!-- Central angle sector -->
      ${isCentralAngle ? `
      <path d="M ${centerX} ${centerY} L ${chordAx} ${chordAy} A ${radius} ${radius} 0 0 1 ${chordBx} ${chordBy} Z" class="central-angle" />
      ` : ''}
      
      <!-- Inscribed angle sector -->
      ${hasInscribedAngle ? `
      <path d="M ${pointCx} ${pointCy} L ${chordAx} ${chordAy} L ${chordBx} ${chordBy} Z" class="inscribed-angle" />
      ` : ''}
      
      <!-- Radii from center to chord endpoints -->
      <line x1="${centerX}" y1="${centerY}" x2="${chordAx}" y2="${chordAy}" class="radius" />
      <line x1="${centerX}" y1="${centerY}" x2="${chordBx}" y2="${chordBy}" class="radius" />
      
      <!-- Lines for inscribed angle -->
      ${hasInscribedAngle ? `
      <line x1="${pointCx}" y1="${pointCy}" x2="${chordAx}" y2="${chordAy}" stroke="#f59e0b" stroke-width="2" />
      <line x1="${pointCx}" y1="${pointCy}" x2="${chordBx}" y2="${chordBy}" stroke="#f59e0b" stroke-width="2" />
      
      <!-- Inscribed angle arc indicator -->
      <path d="M ${pointCx-20} ${pointCy-10} A 25 25 0 0 1 ${pointCx+20} ${pointCy-10}" fill="none" stroke="#f59e0b" stroke-width="2" />
      ` : ''}
      
      <!-- Central angle arc indicator -->
      ${isCentralAngle ? `
      <path d="M ${centerX-25} ${centerY-15} A 30 30 0 0 1 ${centerX+25} ${centerY-15}" fill="none" stroke="#8b5cf6" stroke-width="2" />
      ` : ''}
      
      <!-- Points -->
      <circle cx="${centerX}" cy="${centerY}" r="4" class="center-point" />
      <circle cx="${chordAx}" cy="${chordAy}" r="4" class="point" />
      <circle cx="${chordBx}" cy="${chordBy}" r="4" class="point" />
      ${hasInscribedAngle ? `<circle cx="${pointCx}" cy="${pointCy}" r="4" class="point" />` : ''}
      
      <!-- Labels -->
      <text x="${centerX - 15}" y="${centerY - 10}" class="label">O</text>
      <text x="${chordAx - 15}" y="${chordAy - 10}" class="label">${chord[0]}</text>
      <text x="${chordBx + 10}" y="${chordBy - 10}" class="label">${chord[1]}</text>
      ${hasInscribedAngle ? `<text x="${pointCx - 10}" y="${pointCy + 20}" class="label">${point}</text>` : ''}
      
      <!-- Angle measurements -->
      ${isCentralAngle ? `
      <text x="${centerX - 30}" y="${centerY - 40}" class="angle-label">∠${chord[0]}O${chord[1]} = ${angle}°</text>
      ` : ''}
      ${hasInscribedAngle ? `
      <text x="${pointCx - 35}" y="${pointCy - 25}" class="angle-label">∠${chord[0]}${point}${chord[1]} = ${Math.round(angle/2)}°</text>
      ` : ''}
      
      <!-- Title -->
      <text x="250" y="25" class="title" text-anchor="middle">${instruction}</text>
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

function generateCylinderSVG(instruction: string): string {
  // Extract radius and height information from instruction
  const radiusMatch = instruction.match(/radius\s+(\d+(?:\.\d+)?)/i);
  const heightMatch = instruction.match(/height\s+(\d+(?:\.\d+)?)/i);
  
  const baseRadius = radiusMatch ? parseFloat(radiusMatch[1]) : 3;
  const height = heightMatch ? parseFloat(heightMatch[1]) : 5;
  
  // Check if instruction mentions surface area or painting
  const isSurfaceArea = instruction.match(/surface\s+area|paint|label.*surface|curved.*surface|CSA|total.*area/i);
  
  // Check if instruction mentions two cylinders (comparison)
  const twoTraderMatch = instruction.match(/then.*cylinder|second.*cylinder|another.*cylinder/i);
  const isTwoCylinders = !!twoTraderMatch;
  
  // Extract multiplier for second cylinder
  const multiplierMatch = instruction.match(/radius\s+(\d+)r|tripled|doubled|(\d+(?:\.\d+)?)\s*times/i);
  const multiplier = multiplierMatch ? (multiplierMatch[1] ? parseFloat(multiplierMatch[1]) : 3) : 2;
  
  if (isTwoCylinders) {
    return `
      <svg width="500" height="350" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .cylinder-fill { fill: #e0f2fe; stroke: #0277bd; stroke-width: 2; }
            .cylinder-edge { fill: none; stroke: #0277bd; stroke-width: 2; }
            .dashed { stroke-dasharray: 5,5; opacity: 0.6; }
            .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; text-anchor: middle; }
            .title { font-family: Arial, sans-serif; font-size: 11px; fill: #6b7280; }
          </style>
          <linearGradient id="cylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#b3e5fc"/>
            <stop offset="50%" style="stop-color:#e1f5fe"/>
            <stop offset="100%" style="stop-color:#b3e5fc"/>
          </linearGradient>
        </defs>
        
        <!-- First Cylinder -->
        <g transform="translate(120, 80)">
          <!-- Cylinder body -->
          <rect x="-30" y="0" width="60" height="${height * 15}" fill="url(#cylinderGrad)" class="cylinder-edge"/>
          <!-- Top ellipse -->
          <ellipse cx="0" cy="0" rx="30" ry="8" class="cylinder-fill"/>
          <!-- Bottom ellipse -->
          <ellipse cx="0" cy="${height * 15}" rx="30" ry="8" class="cylinder-fill"/>
          <!-- Hidden back edge -->
          <ellipse cx="0" cy="0" rx="30" ry="8" class="cylinder-edge dashed"/>
          
          <!-- Labels -->
          <text x="0" y="-20" class="label">Original Cylinder</text>
          <text x="0" y="${height * 15 + 25}" class="label">r = ${baseRadius}, h = ${height}</text>
          <line x1="30" y1="${height * 7.5}" x2="45" y2="${height * 7.5}" class="cylinder-edge"/>
          <text x="50" y="${height * 7.5 + 5}" class="label">r</text>
        </g>
        
        <!-- Second Cylinder -->
        <g transform="translate(350, 80)">
          <!-- Cylinder body -->
          <rect x="-${30 * multiplier}" y="0" width="${60 * multiplier}" height="${height * 15}" fill="url(#cylinderGrad)" class="cylinder-edge"/>
          <!-- Top ellipse -->
          <ellipse cx="0" cy="0" rx="${30 * multiplier}" ry="${8 * multiplier}" class="cylinder-fill"/>
          <!-- Bottom ellipse -->
          <ellipse cx="0" cy="${height * 15}" rx="${30 * multiplier}" ry="${8 * multiplier}" class="cylinder-fill"/>
          <!-- Hidden back edge -->
          <ellipse cx="0" cy="0" rx="${30 * multiplier}" ry="${8 * multiplier}" class="cylinder-edge dashed"/>
          
          <!-- Labels -->
          <text x="0" y="-20" class="label">Modified Cylinder</text>
          <text x="0" y="${height * 15 + 25}" class="label">r = ${baseRadius * multiplier}, h = ${height}</text>
          <line x1="${30 * multiplier}" y1="${height * 7.5}" x2="${45 * multiplier}" y2="${height * 7.5}" class="cylinder-edge"/>
          <text x="${50 * multiplier}" y="${height * 7.5 + 5}" class="label">${multiplier}r</text>
        </g>
        
        <!-- Instruction text -->
        <text x="250" y="25" class="title" text-anchor="middle">${instruction}</text>
      </svg>
    `;
  } else if (isSurfaceArea) {
    // Surface area focused diagram with proper labels
    return `
      <svg width="500" height="420" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .cylinder-fill { fill: #e0f2fe; stroke: #0277bd; stroke-width: 2; }
            .cylinder-edge { fill: none; stroke: #0277bd; stroke-width: 2; }
            .surface-label { fill: #dc2626; stroke: #dc2626; stroke-width: 1; }
            .dashed { stroke-dasharray: 5,5; opacity: 0.6; }
            .label { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; text-anchor: middle; }
            .surface-text { font-family: Arial, sans-serif; font-size: 12px; fill: #dc2626; text-anchor: middle; font-weight: bold; }
            .title { font-family: Arial, sans-serif; font-size: 12px; fill: #6b7280; }
          </style>
          <linearGradient id="cylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#b3e5fc"/>
            <stop offset="50%" style="stop-color:#e1f5fe"/>
            <stop offset="100%" style="stop-color:#b3e5fc"/>
          </linearGradient>
        </defs>
        
        <!-- Main Cylinder -->
        <g transform="translate(250, 80)">
          <!-- Cylinder body -->
          <rect x="-60" y="0" width="120" height="${height * 25}" fill="url(#cylinderGrad)" class="cylinder-edge"/>
          <!-- Top ellipse -->
          <ellipse cx="0" cy="0" rx="60" ry="15" class="cylinder-fill"/>
          <!-- Bottom ellipse -->
          <ellipse cx="0" cy="${height * 25}" rx="60" ry="15" class="cylinder-fill"/>
          <!-- Hidden back edge -->
          <ellipse cx="0" cy="0" rx="60" ry="15" class="cylinder-edge dashed"/>
          
          <!-- Surface Area Labels -->
          <!-- Top Base -->
          <text x="0" y="-30" class="surface-text">Top Base (πr²)</text>
          <circle cx="0" cy="0" r="3" class="surface-label"/>
          
          <!-- Bottom Base -->
          <text x="0" y="${height * 25 + 35}" class="surface-text">Bottom Base (πr²)</text>
          <circle cx="0" cy="${height * 25}" r="3" class="surface-label"/>
          
          <!-- Curved Surface Area -->
          <text x="100" y="${height * 12.5}" class="surface-text">Curved Surface Area</text>
          <text x="100" y="${height * 12.5 + 15}" class="surface-text">CSA = 2πrh</text>
          <line x1="60" y1="${height * 8}" x2="90" y2="${height * 8}" class="surface-label"/>
          <line x1="60" y1="${height * 17}" x2="90" y2="${height * 17}" class="surface-label"/>
          <line x1="90" y1="${height * 8}" x2="90" y2="${height * 17}" class="surface-label"/>
          
          <!-- Dimension Labels -->
          <text x="0" y="${height * 25 + 60}" class="label">r = ${baseRadius} cm, h = ${height} cm</text>
          <line x1="60" y1="${height * 12.5}" x2="80" y2="${height * 12.5}" class="cylinder-edge"/>
          <text x="90" y="${height * 12.5 + 5}" class="label">r</text>
          <line x1="-80" y1="0" x2="-80" y2="${height * 25}" class="cylinder-edge"/>
          <text x="-90" y="${height * 12.5}" class="label" transform="rotate(-90, -90, ${height * 12.5})">h</text>
        </g>
        
        <!-- Total Surface Area Formula -->
        <text x="250" y="380" class="label" style="font-weight: bold;">Total Surface Area = 2πr² + 2πrh</text>
        
        <!-- Title -->
        <text x="250" y="25" class="title" style="text-anchor: middle; font-weight: bold;">${instruction}</text>
      </svg>
    `;
  } else {
    // Single cylinder - larger size
    return `
      <svg width="500" height="380" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .cylinder-fill { fill: #e0f2fe; stroke: #0277bd; stroke-width: 2; }
            .cylinder-edge { fill: none; stroke: #0277bd; stroke-width: 2; }
            .dashed { stroke-dasharray: 5,5; opacity: 0.6; }
            .label { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; text-anchor: middle; }
            .title { font-family: Arial, sans-serif; font-size: 12px; fill: #6b7280; }
          </style>
          <linearGradient id="cylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#b3e5fc"/>
            <stop offset="50%" style="stop-color:#e1f5fe"/>
            <stop offset="100%" style="stop-color:#b3e5fc"/>
          </linearGradient>
        </defs>
        
        <!-- Single Cylinder -->
        <g transform="translate(250, 80)">
          <!-- Cylinder body -->
          <rect x="-60" y="0" width="120" height="${height * 25}" fill="url(#cylinderGrad)" class="cylinder-edge"/>
          <!-- Top ellipse -->
          <ellipse cx="0" cy="0" rx="60" ry="15" class="cylinder-fill"/>
          <!-- Bottom ellipse -->
          <ellipse cx="0" cy="${height * 25}" rx="60" ry="15" class="cylinder-fill"/>
          <!-- Hidden back edge -->
          <ellipse cx="0" cy="0" rx="60" ry="15" class="cylinder-edge dashed"/>
          
          <!-- Dimension labels -->
          <line x1="60" y1="${height * 12.5}" x2="80" y2="${height * 12.5}" class="cylinder-edge"/>
          <text x="90" y="${height * 12.5 + 5}" class="label">r = ${baseRadius}</text>
          
          <line x1="-80" y1="0" x2="-80" y2="${height * 25}" class="cylinder-edge"/>
          <text x="-90" y="${height * 12.5}" class="label" transform="rotate(-90, -90, ${height * 12.5})">h = ${height}</text>
          
          <!-- Bottom label -->
          <text x="0" y="${height * 25 + 40}" class="label">Cylinder: r = ${baseRadius} cm, h = ${height} cm</text>
        </g>
        
        <!-- Instruction text -->
        <text x="250" y="25" class="title" style="text-anchor: middle; font-weight: bold;">${instruction}</text>
      </svg>
    `;
  }
}

// CURRICULUM-SPECIFIC DIAGRAM GENERATORS

function generateParallelogramSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .shape { fill: #e0f2fe; stroke: #0277bd; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
          .property { font-family: Arial, sans-serif; font-size: 10px; fill: #059669; }
        </style>
      </defs>
      
      <!-- Parallelogram ABCD -->
      <polygon points="80,200 220,200 300,80 160,80" class="shape" />
      
      <!-- Vertices -->
      <circle cx="80" cy="200" r="3" fill="#dc2626" />
      <circle cx="220" cy="200" r="3" fill="#dc2626" />
      <circle cx="300" cy="80" r="3" fill="#dc2626" />
      <circle cx="160" cy="80" r="3" fill="#dc2626" />
      
      <!-- Labels -->
      <text x="70" y="215" class="label">A</text>
      <text x="230" y="215" class="label">B</text>
      <text x="310" y="75" class="label">C</text>
      <text x="150" y="75" class="label">D</text>
      
      <!-- Properties -->
      <text x="150" y="140" class="property">AB ∥ DC</text>
      <text x="120" y="160" class="property">AD ∥ BC</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
    </svg>
  `;
}

function generateCongruentTrianglesSVG(instruction: string): string {
  return `
    <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .triangle1 { fill: #fef3c7; stroke: #f59e0b; stroke-width: 2; }
          .triangle2 { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
          .congruent { font-family: Arial, sans-serif; font-size: 10px; fill: #dc2626; }
        </style>
      </defs>
      
      <!-- Triangle ABC -->
      <polygon points="100,200 180,80 200,200" class="triangle1" />
      <text x="90" y="215" class="label">A</text>
      <text x="175" y="75" class="label">B</text>
      <text x="210" y="215" class="label">C</text>
      
      <!-- Triangle DEF -->
      <polygon points="320,200 400,80 420,200" class="triangle2" />
      <text x="310" y="215" class="label">D</text>
      <text x="395" y="75" class="label">E</text>
      <text x="430" y="215" class="label">F</text>
      
      <!-- Congruency symbol -->
      <text x="250" y="150" class="congruent">≅</text>
      <text x="220" y="170" class="congruent">△ABC ≅ △DEF</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
    </svg>
  `;
}

function generateMidpointTheoremSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .triangle { fill: none; stroke: #0277bd; stroke-width: 2; }
          .midline { stroke: #dc2626; stroke-width: 2; stroke-dasharray: 5,5; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
          .theorem { font-family: Arial, sans-serif; font-size: 10px; fill: #059669; }
        </style>
      </defs>
      
      <!-- Triangle ABC -->
      <polygon points="200,60 120,220 280,220" class="triangle" />
      
      <!-- Midpoints -->
      <circle cx="160" cy="140" r="3" fill="#dc2626" />
      <circle cx="240" cy="140" r="3" fill="#dc2626" />
      
      <!-- Midline DE -->
      <line x1="160" y1="140" x2="240" y2="140" class="midline" />
      
      <!-- Labels -->
      <text x="195" y="55" class="label">A</text>
      <text x="110" y="235" class="label">B</text>
      <text x="290" y="235" class="label">C</text>
      <text x="150" y="135" class="label">D</text>
      <text x="250" y="135" class="label">E</text>
      
      <!-- Theorem statement -->
      <text x="120" y="260" class="theorem">DE ∥ BC and DE = ½BC</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
    </svg>
  `;
}

function generatePythagorasTheoremSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .triangle { fill: #fef3c7; stroke: #f59e0b; stroke-width: 2; }
          .square1 { fill: #fecaca; stroke: #dc2626; stroke-width: 1; }
          .square2 { fill: #dbeafe; stroke: #3b82f6; stroke-width: 1; }
          .square3 { fill: #dcfce7; stroke: #16a34a; stroke-width: 1; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
          .formula { font-family: Arial, sans-serif; font-size: 14px; fill: #dc2626; font-weight: bold; }
        </style>
      </defs>
      
      <!-- Right triangle -->
      <polygon points="150,200 150,120 230,200" class="triangle" />
      
      <!-- Square on hypotenuse -->
      <rect x="150" y="40" width="80" height="80" class="square1" />
      
      <!-- Square on side a -->
      <rect x="70" y="120" width="80" height="80" class="square2" />
      
      <!-- Square on side b -->
      <rect x="230" y="120" width="80" height="80" class="square3" />
      
      <!-- Labels -->
      <text x="140" y="215" class="label">A</text>
      <text x="140" y="115" class="label">B</text>
      <text x="240" y="215" class="label">C</text>
      
      <!-- Side labels -->
      <text x="110" y="165" class="label">a</text>
      <text x="270" y="165" class="label">b</text>
      <text x="185" y="105" class="label">c</text>
      
      <!-- Pythagoras formula -->
      <text x="120" y="260" class="formula">a² + b² = c²</text>
      
      <!-- Instruction -->
      <text x="50" y="25" class="label">${instruction}</text>
    </svg>
  `;
}

function generateChordPropertiesSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .circle { fill: none; stroke: #0277bd; stroke-width: 2; }
          .chord { stroke: #dc2626; stroke-width: 2; }
          .perpendicular { stroke: #059669; stroke-width: 2; stroke-dasharray: 3,3; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
        </style>
      </defs>
      
      <!-- Circle -->
      <circle cx="200" cy="150" r="80" class="circle" />
      
      <!-- Chord AB -->
      <line x1="150" y1="100" x2="250" y2="200" class="chord" />
      
      <!-- Perpendicular from center -->
      <line x1="200" y1="150" x2="200" y2="150" class="perpendicular" />
      
      <!-- Center -->
      <circle cx="200" cy="150" r="3" fill="#666" />
      
      <!-- Labels -->
      <text x="140" y="95" class="label">A</text>
      <text x="260" y="205" class="label">B</text>
      <text x="205" y="145" class="label">O</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
    </svg>
  `;
}

function generateQuadrilateralSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .quad { fill: #fef3c7; stroke: #f59e0b; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
        </style>
      </defs>
      
      <!-- Quadrilateral ABCD -->
      <polygon points="100,80 280,100 260,220 120,200" class="quad" />
      
      <!-- Vertices -->
      <text x="90" y="75" class="label">A</text>
      <text x="290" y="95" class="label">B</text>
      <text x="270" y="235" class="label">C</text>
      <text x="110" y="215" class="label">D</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
    </svg>
  `;
}

function generateCuboidSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .face { fill: #e0f2fe; stroke: #0277bd; stroke-width: 2; }
          .hidden { stroke-dasharray: 5,5; opacity: 0.6; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
        </style>
      </defs>
      
      <!-- Front face -->
      <rect x="100" y="120" width="120" height="80" class="face" />
      
      <!-- Back face (offset) -->
      <rect x="150" y="80" width="120" height="80" class="face hidden" />
      
      <!-- Connecting edges -->
      <line x1="100" y1="120" x2="150" y2="80" stroke="#0277bd" stroke-width="2" />
      <line x1="220" y1="120" x2="270" y2="80" stroke="#0277bd" stroke-width="2" />
      <line x1="220" y1="200" x2="270" y2="160" stroke="#0277bd" stroke-width="2" />
      <line x1="100" y1="200" x2="150" y2="160" stroke="#0277bd" stroke-width="2" />
      
      <!-- Dimension labels -->
      <text x="160" y="215" class="label">length</text>
      <text x="75" y="165" class="label">height</text>
      <text x="285" y="125" class="label">width</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
    </svg>
  `;
}

function generateCoordinateGeometrySVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .axis { stroke: #6b7280; stroke-width: 1; }
          .point { fill: #dc2626; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
        </style>
      </defs>
      
      <!-- X-axis -->
      <line x1="50" y1="150" x2="350" y2="150" class="axis" />
      <text x="355" y="155" class="label">X</text>
      
      <!-- Y-axis -->
      <line x1="200" y1="50" x2="200" y2="250" class="axis" />
      <text x="205" y="45" class="label">Y</text>
      
      <!-- Grid marks -->
      <line x1="150" y1="145" x2="150" y2="155" class="axis" />
      <line x1="250" y1="145" x2="250" y2="155" class="axis" />
      <line x1="195" y1="100" x2="205" y2="100" class="axis" />
      <line x1="195" y1="200" x2="205" y2="200" class="axis" />
      
      <!-- Sample points -->
      <circle cx="250" cy="100" r="3" class="point" />
      <text x="255" y="95" class="label">A(2, 2)</text>
      
      <!-- Origin -->
      <text x="185" y="165" class="label">O</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
    </svg>
  `;
}

function generateLinearEquationSVG(instruction: string): string {
  return generateCoordinateGeometrySVG(instruction);
}

function generateNumberLineSVG(instruction: string): string {
  return `
    <svg width="400" height="150" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .line { stroke: #6b7280; stroke-width: 2; }
          .tick { stroke: #6b7280; stroke-width: 1; }
          .point { fill: #dc2626; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; text-anchor: middle; }
        </style>
      </defs>
      
      <!-- Number line -->
      <line x1="50" y1="75" x2="350" y2="75" class="line" />
      
      <!-- Tick marks and labels -->
      <line x1="100" y1="70" x2="100" y2="80" class="tick" />
      <text x="100" y="95" class="label">-2</text>
      
      <line x1="150" y1="70" x2="150" y2="80" class="tick" />
      <text x="150" y="95" class="label">-1</text>
      
      <line x1="200" y1="70" x2="200" y2="80" class="tick" />
      <text x="200" y="95" class="label">0</text>
      
      <line x1="250" y1="70" x2="250" y2="80" class="tick" />
      <text x="250" y="95" class="label">1</text>
      
      <line x1="300" y1="70" x2="300" y2="80" class="tick" />
      <text x="300" y="95" class="label">2</text>
      
      <!-- Sample rational/irrational points -->
      <circle cx="175" cy="75" r="3" class="point" />
      <text x="175" y="60" class="label">√2</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
    </svg>
  `;
}

function generatePolynomialSVG(instruction: string): string {
  return generateCoordinateGeometrySVG(instruction);
}

function generateBarGraphSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .bar { fill: #3b82f6; stroke: #1e40af; stroke-width: 1; }
          .axis { stroke: #6b7280; stroke-width: 1; }
          .label { font-family: Arial, sans-serif; font-size: 10px; fill: #1f2937; text-anchor: middle; }
        </style>
      </defs>
      
      <!-- Axes -->
      <line x1="60" y1="60" x2="60" y2="240" class="axis" />
      <line x1="60" y1="240" x2="340" y2="240" class="axis" />
      
      <!-- Sample bars -->
      <rect x="80" y="180" width="40" height="60" class="bar" />
      <rect x="140" y="140" width="40" height="100" class="bar" />
      <rect x="200" y="160" width="40" height="80" class="bar" />
      <rect x="260" y="120" width="40" height="120" class="bar" />
      
      <!-- Labels -->
      <text x="100" y="255" class="label">A</text>
      <text x="160" y="255" class="label">B</text>
      <text x="220" y="255" class="label">C</text>
      <text x="280" y="255" class="label">D</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
    </svg>
  `;
}

function generatePieChartSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .slice1 { fill: #3b82f6; stroke: white; stroke-width: 2; }
          .slice2 { fill: #ef4444; stroke: white; stroke-width: 2; }
          .slice3 { fill: #10b981; stroke: white; stroke-width: 2; }
          .slice4 { fill: #f59e0b; stroke: white; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
        </style>
      </defs>
      
      <!-- Pie chart circle -->
      <circle cx="200" cy="150" r="80" fill="none" stroke="#ddd" stroke-width="1" />
      
      <!-- Sample pie slices -->
      <path d="M 200,150 L 280,150 A 80,80 0 0,1 240,220 Z" class="slice1" />
      <path d="M 200,150 L 240,220 A 80,80 0 0,1 160,220 Z" class="slice2" />
      <path d="M 200,150 L 160,220 A 80,80 0 0,1 120,150 Z" class="slice3" />
      <path d="M 200,150 L 120,150 A 80,80 0 1,1 280,150 Z" class="slice4" />
      
      <!-- Labels -->
      <text x="250" y="180" class="label">25%</text>
      <text x="190" y="210" class="label">20%</text>
      <text x="140" y="180" class="label">15%</text>
      <text x="180" y="120" class="label">40%</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
    </svg>
  `;
}

function generateConstructionSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .construction { stroke: #0277bd; stroke-width: 2; fill: none; }
          .compass { stroke: #dc2626; stroke-width: 1; stroke-dasharray: 3,3; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
        </style>
      </defs>
      
      <!-- Base line -->
      <line x1="80" y1="200" x2="320" y2="200" class="construction" />
      
      <!-- Compass arcs -->
      <circle cx="150" cy="200" r="60" class="compass" />
      <circle cx="250" cy="200" r="60" class="compass" />
      
      <!-- Construction lines -->
      <line x1="200" y1="80" x2="200" y2="200" class="construction" />
      
      <!-- Labels -->
      <text x="75" y="215" class="label">A</text>
      <text x="325" y="215" class="label">B</text>
      <text x="205" y="75" class="label">P</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
    </svg>
  `;
}

function generateHexagonSVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .hexagon { fill: #fef3c7; stroke: #f59e0b; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
        </style>
      </defs>
      
      <!-- Regular hexagon -->
      <polygon points="200,80 250,115 250,185 200,220 150,185 150,115" class="hexagon" />
      
      <!-- Center -->
      <circle cx="200" cy="150" r="3" fill="#dc2626" />
      <text x="205" y="155" class="label">O</text>
      
      <!-- Vertices -->
      <text x="195" y="75" class="label">A</text>
      <text x="255" y="110" class="label">B</text>
      <text x="255" y="190" class="label">C</text>
      <text x="195" y="235" class="label">D</text>
      <text x="135" y="190" class="label">E</text>
      <text x="135" y="110" class="label">F</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
    </svg>
  `;
}

function generateTrigonometrySVG(instruction: string): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .triangle { fill: #fef3c7; stroke: #f59e0b; stroke-width: 2; }
          .right-angle { stroke: #dc2626; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1f2937; }
          .ratio { font-family: Arial, sans-serif; font-size: 10px; fill: #059669; }
        </style>
      </defs>
      
      <!-- Right triangle -->
      <polygon points="150,200 150,100 250,200" class="triangle" />
      
      <!-- Right angle indicator -->
      <rect x="150" y="180" width="20" height="20" fill="none" class="right-angle" />
      
      <!-- Labels -->
      <text x="140" y="215" class="label">A</text>
      <text x="140" y="95" class="label">B</text>
      <text x="260" y="215" class="label">C</text>
      
      <!-- Side labels -->
      <text x="125" y="155" class="label">b</text>
      <text x="200" y="215" class="label">a</text>
      <text x="185" y="145" class="label">c</text>
      
      <!-- Trigonometric ratios -->
      <text x="50" y="250" class="ratio">sin θ = opposite/hypotenuse = a/c</text>
      <text x="50" y="265" class="ratio">cos θ = adjacent/hypotenuse = b/c</text>
      <text x="50" y="280" class="ratio">tan θ = opposite/adjacent = a/b</text>
      
      <!-- Instruction -->
      <text x="50" y="30" class="label">${instruction}</text>
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

// New Economics diagram generator for board-quality graphs
function generateEconomicsDiagramSVG(instruction: string): string {
  const lower = instruction.toLowerCase();
  
  // Demand & Supply Curve
  if ((lower.includes("demand") && lower.includes("supply")) || 
      (lower.includes("demand") || lower.includes("supply"))) {
    return generateDemandSupplyGraphSVG(instruction);
  }
  
  // Production Possibility Curve (PPC)
  if (lower.includes("production possibility") || lower.includes("ppc") || lower.includes("ppf")) {
    return generatePPCGraphSVG(instruction);
  }
  
  // Default to demand-supply if no specific type found
  return generateDemandSupplyGraphSVG(instruction);
}

// Demand & Supply Graph with equilibrium point
function generateDemandSupplyGraphSVG(instruction: string): string {
  const lower = instruction.toLowerCase();
  const hasSupply = lower.includes("supply");
  const hasDemand = lower.includes("demand");
  const hasShift = lower.includes("shift") || lower.includes("increase") || lower.includes("decrease");
  const hasEquilibrium = lower.includes("equilibrium");
  
  // Create unique variations based on instruction content
  const hash = instruction.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
  const offsetX = (Math.abs(hash) % 40) - 20; // -20 to +20
  const offsetY = (Math.abs(hash * 2) % 30) - 15; // -15 to +15
  const curveType = Math.abs(hash) % 3; // 0, 1, or 2 for different curve shapes
  
  let demandPath = '';
  let supplyPath = '';
  let shiftedDemandPath = '';
  let shiftedSupplyPath = '';
  
  // Generate different curve shapes based on hash
  if (curveType === 0) {
    demandPath = `M ${120 + offsetX} ${100 + offsetY} Q ${200 + offsetX} ${150 + offsetY} ${300 + offsetX} ${200 + offsetY} Q ${350 + offsetX} ${230 + offsetY} ${420 + offsetX} ${280 + offsetY}`;
    supplyPath = `M ${120 + offsetX} ${280 + offsetY} Q ${200 + offsetX} ${230 + offsetY} ${300 + offsetX} ${180 + offsetY} Q ${350 + offsetX} ${150 + offsetY} ${420 + offsetX} ${100 + offsetY}`;
  } else if (curveType === 1) {
    demandPath = `M ${130 + offsetX} ${90 + offsetY} L ${180 + offsetX} ${140 + offsetY} L ${280 + offsetX} ${190 + offsetY} L ${380 + offsetX} ${270 + offsetY}`;
    supplyPath = `M ${130 + offsetX} ${270 + offsetY} L ${180 + offsetX} ${220 + offsetY} L ${280 + offsetX} ${170 + offsetY} L ${380 + offsetX} ${90 + offsetY}`;
  } else {
    demandPath = `M ${110 + offsetX} ${110 + offsetY} Q ${250 + offsetX} ${160 + offsetY} ${410 + offsetX} ${270 + offsetY}`;
    supplyPath = `M ${110 + offsetX} ${270 + offsetY} Q ${250 + offsetX} ${200 + offsetY} ${410 + offsetX} ${110 + offsetY}`;
  }
  
  if (hasShift) {
    shiftedDemandPath = `M ${140 + offsetX} ${80 + offsetY} Q ${220 + offsetX} ${130 + offsetY} ${320 + offsetX} ${180 + offsetY} Q ${370 + offsetX} ${210 + offsetY} ${440 + offsetX} ${260 + offsetY}`;
    shiftedSupplyPath = `M ${140 + offsetX} ${260 + offsetY} Q ${220 + offsetX} ${210 + offsetY} ${320 + offsetX} ${160 + offsetY} Q ${370 + offsetX} ${130 + offsetY} ${440 + offsetX} ${80 + offsetY}`;
  }
  
  const priceValue = Math.floor(Math.abs(hash) % 500) + 100;
  const quantityValue = Math.floor(Math.abs(hash * 3) % 1000) + 200;
  
  return `
    <svg width="500" height="400" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .axis { stroke: #2d3748; stroke-width: 2; fill: none; }
          .grid { stroke: #e2e8f0; stroke-width: 1; fill: none; }
          .curve { stroke-width: 3; fill: none; }
          .demand { stroke: #3182ce; }
          .supply { stroke: #e53e3e; }
          .shifted { stroke-width: 2; stroke-dasharray: 8,4; }
          .demand-shifted { stroke: #60a5fa; }
          .supply-shifted { stroke: #fca5a5; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #2d3748; font-weight: bold; }
          .axis-label { font-family: Arial, sans-serif; font-size: 12px; fill: #4a5568; }
          .point { fill: #2d3748; }
        </style>
      </defs>
      
      <!-- Grid lines -->
      <defs>
        <pattern id="econ-grid-${Math.abs(hash)}" width="40" height="30" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 30" class="grid"/>
        </pattern>
      </defs>
      <rect width="400" height="300" x="80" y="50" fill="url(#econ-grid-${Math.abs(hash)})" opacity="0.3"/>
      
      <!-- Axes -->
      <line x1="80" y1="350" x2="480" y2="350" class="axis"/>
      <line x1="80" y1="50" x2="80" y2="350" class="axis"/>
      
      <!-- Axis labels with Indian currency -->
      <text x="280" y="380" class="axis-label" text-anchor="middle">Quantity (Units)</text>
      <text x="30" y="200" class="axis-label" text-anchor="middle" transform="rotate(-90, 30, 200)">Price (₹)</text>
      
      ${hasDemand ? `
      <!-- Demand Curve -->
      <path d="${demandPath}" class="curve demand"/>
      <text x="${430 + offsetX}" y="${285 + offsetY}" class="label demand">D</text>
      ${hasShift ? `<path d="${shiftedDemandPath}" class="curve demand-shifted shifted"/>
      <text x="${450 + offsetX}" y="${265 + offsetY}" class="label demand-shifted">D'</text>` : ''}
      ` : ""}
      
      ${hasSupply ? `
      <!-- Supply Curve -->
      <path d="${supplyPath}" class="curve supply"/>
      <text x="${430 + offsetX}" y="${105 + offsetY}" class="label supply">S</text>
      ${hasShift ? `<path d="${shiftedSupplyPath}" class="curve supply-shifted shifted"/>
      <text x="${450 + offsetX}" y="${85 + offsetY}" class="label supply-shifted">S'</text>` : ''}
      ` : ""}
      
      ${hasDemand && hasSupply && hasEquilibrium ? `
      <!-- Equilibrium Point -->
      <circle cx="${300 + offsetX}" cy="${190 + offsetY}" r="4" class="point"/>
      <text x="${310 + offsetX}" y="${185 + offsetY}" class="label">E</text>
      <line x1="80" y1="${190 + offsetY}" x2="${300 + offsetX}" y2="${190 + offsetY}" class="grid" stroke-dasharray="5,5"/>
      <line x1="${300 + offsetX}" y1="${190 + offsetY}" x2="${300 + offsetX}" y2="350" class="grid" stroke-dasharray="5,5"/>
      <text x="60" y="${195 + offsetY}" class="axis-label">₹${priceValue}</text>
      <text x="${295 + offsetX}" y="370" class="axis-label">${quantityValue}</text>
      ` : ""}
      
      <!-- Title with question context -->
      <text x="280" y="30" class="label" text-anchor="middle" style="font-size: 16px;">
        ${instruction.substring(0, 60)}${instruction.length > 60 ? '...' : ''}
      </text>
    </svg>
  `;
}

// Production Possibility Curve (PPC)
function generatePPCGraphSVG(instruction: string): string {
  return `
    <svg width="500" height="400" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .axis { stroke: #2d3748; stroke-width: 2; fill: none; }
          .grid { stroke: #e2e8f0; stroke-width: 1; fill: none; }
          .ppc { stroke: #805ad5; stroke-width: 3; fill: none; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #2d3748; font-weight: bold; }
          .axis-label { font-family: Arial, sans-serif; font-size: 12px; fill: #4a5568; }
          .point { fill: #2d3748; }
          .point-a { fill: #e53e3e; }
          .point-b { fill: #3182ce; }
          .point-c { fill: #38a169; }
        </style>
      </defs>
      
      <!-- Grid lines -->
      <defs>
        <pattern id="ppc-grid" width="40" height="30" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 30" class="grid"/>
        </pattern>
      </defs>
      <rect width="380" height="280" x="80" y="50" fill="url(#ppc-grid)" opacity="0.3"/>
      
      <!-- Axes -->
      <line x1="80" y1="330" x2="460" y2="330" class="axis"/>
      <line x1="80" y1="50" x2="80" y2="330" class="axis"/>
      
      <!-- Axis labels -->
      <text x="270" y="360" class="axis-label" text-anchor="middle">Good X (Consumer Goods)</text>
      <text x="25" y="190" class="axis-label" text-anchor="middle" transform="rotate(-90, 25, 190)">Good Y (Capital Goods)</text>
      
      <!-- PPC Curve (concave to origin) -->
      <path d="M 120 80 Q 200 100 280 140 Q 350 200 420 300" class="ppc"/>
      
      <!-- Points on and around PPC -->
      <circle cx="200" cy="105" r="4" class="point-a"/>
      <text x="185" y="100" class="label point-a">A</text>
      
      <circle cx="280" cy="140" r="4" class="point-b"/>
      <text x="290" y="135" class="label point-b">B</text>
      
      <circle cx="350" cy="200" r="4" class="point-c"/>
      <text x="360" y="195" class="label point-c">C</text>
      
      <!-- Title -->
      <text x="270" y="30" class="label" text-anchor="middle" style="font-size: 16px;">
        Production Possibility Curve (PPC)
      </text>
      
      <!-- Legend -->
      <text x="90" y="380" class="axis-label" style="font-size: 10px;">
        Points A, B, C: Efficient production combinations
      </text>
    </svg>
  `;
}
