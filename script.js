const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const questionElement = document.getElementById('question');
const submitAnswerButton = document.getElementById('submit-answer');
const userAnswerInput = document.getElementById('user-answer');

// Wheel segments
const segments = [
    { category: "Fundamental Rights", question: "What protects your right to freedom of speech?" },
    { category: "Duties of Citizens", question: "What is one duty of every citizen in a democracy?" },
    { category: "Judicial System", question: "Who is the highest authority in the Indian judiciary?" },
    { category: "Elections", question: "How often are general elections held in India?" },
    { category: "Directive Principles", question: "Which principle guides government welfare policies?" }
];

// Wood-like colors for the wheel segments
const woodColors = [
    '#8B4513', // SaddleBrown
    '#A0522D', // Sienna
    '#D2691E', // Chocolate
    '#CD853F', // Peru
    '#F4A460'  // SandyBrown
];

let currentAngle = 0;
let spinning = false;

// Draw the wheel with wooden colors
function drawWheel() {
    const segmentAngle = 2 * Math.PI / segments.length;
    
    for (let i = 0; i < segments.length; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, currentAngle, currentAngle + segmentAngle);
        ctx.closePath();
        ctx.fillStyle = woodColors[i];  // Apply wooden color to each segment
        ctx.fill();
        ctx.save();

        // Draw segment text
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(currentAngle + segmentAngle / 2);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';

        // Dynamically shrink the font size if text is too long
        const text = segments[i].category;
        const maxWidth = 130; // Limit text width
        ctx.textAlign = 'center';

        // Handle multi-line text for long categories
        wrapText(ctx, text, 100, 10, maxWidth, 18);

        ctx.restore();
        currentAngle += segmentAngle;
    }
}

// Wraps text into multiple lines
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lineNumber = 0;
    const lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    lines.forEach((line, i) => {
        context.fillText(line, x, y + i * lineHeight - (lineHeight * lineNumber));
    });
}

// Spin the wheel
function spinWheel() {
    if (spinning) return;
    spinning = true;
    
    let spinDuration = Math.random() * 3000 + 2000;  // Spin duration is between 2 to 5 seconds
    let spinAngle = 0;
    const spinSpeed = 0.05;

    const spinInterval = setInterval(() => {
        currentAngle += spinSpeed;
        drawWheel();

        if (spinAngle >= spinDuration) {
            clearInterval(spinInterval);
            spinning = false;
            determineResult();
        }
        
        spinAngle += 50;
    }, 20);
}

// Determine the result
function determineResult() {
    const segmentAngle = 2 * Math.PI / segments.length;
    const normalizedAngle = currentAngle % (2 * Math.PI);
    const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
    const selectedSegment = segments[segmentIndex];
    
    questionElement.textContent = selectedSegment.question;
}

// Event listeners
spinButton.addEventListener('click', spinWheel);
submitAnswerButton.addEventListener('click', () => {
    const userAnswer = userAnswerInput.value;
    alert('Your answer: ${userAnswer}');
});

drawWheel();