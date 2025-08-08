class NeuralNetwork {
    constructor() {
        this.weights = this.initializeWeights();
        this.currentValues = null;
    }

    initializeWeights() {
        return {
            // These weights are designed to respond to different patterns in the input
            inputToHidden1: [
                [0.5, -0.5, 0.3],   // First input neuron connections
                [-0.5, 0.5, 0.3],   // Second input neuron connections
                [0.3, 0.3, -0.5],   // Third input neuron connections
                [-0.3, -0.3, 0.5]   // Fourth input neuron connections
            ],
            hidden1ToHidden2: [
                [0.5, -0.4, 0.3],
                [-0.5, 0.4, 0.3],
                [0.2, 0.2, 0.5]
            ],
            hidden2ToOutput: [
                [0.5, -0.5],
                [-0.5, 0.5],
                [0.3, 0.3]
            ]
        };
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    forward(inputs) {
        this.currentValues = {
            inputs: inputs,
            hidden1: [],
            hidden2: [],
            outputs: []
        };

        // First hidden layer
        const hidden1 = this.weights.inputToHidden1[0].map((_, i) => {
            let sum = 0;
            for (let j = 0; j < 4; j++) {
                sum += inputs[j] * this.weights.inputToHidden1[j][i];
            }
            const value = this.sigmoid(sum);
            this.currentValues.hidden1[i] = value;
            return value;
        });

        // Second hidden layer
        const hidden2 = this.weights.hidden1ToHidden2[0].map((_, i) => {
            let sum = 0;
            for (let j = 0; j < 3; j++) {
                sum += hidden1[j] * this.weights.hidden1ToHidden2[j][i];
            }
            const value = this.sigmoid(sum);
            this.currentValues.hidden2[i] = value;
            return value;
        });

        // Output layer
        const outputs = this.weights.hidden2ToOutput[0].map((_, i) => {
            let sum = 0;
            for (let j = 0; j < 3; j++) {
                sum += hidden2[j] * this.weights.hidden2ToOutput[j][i];
            }
            const value = this.sigmoid(sum);
            this.currentValues.outputs[i] = value;
            return value;
        });

        return {
            hidden1,
            hidden2,
            outputs
        };
    }
}

const network = new NeuralNetwork();
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const layers = [4, 3, 3, 2];
    const layerSpacing = canvas.width / (layers.length + 1);
    const nodeSpacing = canvas.height / 5;
    
    // Draw background container with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 20);
    ctx.fill();
    
    // Draw nodes and connections
    for (let l = 0; l < layers.length; l++) {
        const x = layerSpacing * (l + 1);
        for (let n = 0; n < layers[l]; n++) {
            const y = nodeSpacing * (n + 1);
            
            // Draw connections to next layer
            if (l < layers.length - 1) {
                for (let nextN = 0; nextN < layers[l + 1]; nextN++) {
                    const nextX = layerSpacing * (l + 2);
                    const nextY = nodeSpacing * (nextN + 1);
                    
                    // Draw connection line with gradient
                    const gradient = ctx.createLinearGradient(x, y, nextX, nextY);
                    gradient.addColorStop(0, '#3498db22');
                    gradient.addColorStop(1, '#2980b922');
                    
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(nextX, nextY);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.lineWidth = 1;
                }
            }
            
            // Get neuron value
            let value = 0;
            if (network.currentValues) {
                if (l === 0) value = network.currentValues.inputs[n];
                else if (l === 1) value = network.currentValues.hidden1[n];
                else if (l === 2) value = network.currentValues.hidden2[n];
                else value = network.currentValues.outputs[n];
            }
            
            // Draw node with gradient and shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            // Create gradient based on value
            const intensity = value || 0;
            const nodeGradient = ctx.createRadialGradient(x-3, y-3, 2, x, y, 18);
            nodeGradient.addColorStop(0, `rgba(52, 152, 219, ${intensity})`);
            nodeGradient.addColorStop(1, `rgba(41, 128, 185, ${intensity * 0.8})`);
            
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fillStyle = nodeGradient;
            ctx.fill();
            
            // Reset shadow for border
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.lineWidth = 1;
            
            // Draw neuron value
            if (network.currentValues) {
                const valueText = value.toFixed(3);
                ctx.font = '12px "Segoe UI"';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Draw value background
                const textWidth = ctx.measureText(valueText).width;
                ctx.fillStyle = 'white';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
                ctx.shadowBlur = 3;
                ctx.beginPath();
                ctx.roundRect(x - textWidth/2 - 4, y - 10, textWidth + 8, 20, 5);
                ctx.fill();
                
                // Draw value text
                ctx.shadowColor = 'transparent';
                ctx.fillStyle = '#2c3e50';
                ctx.fillText(valueText, x, y);
            }
        }
    }
}

function calculateOutput() {
    const inputs = [
        parseFloat(document.getElementById('input1').value),
        parseFloat(document.getElementById('input2').value),
        parseFloat(document.getElementById('input3').value),
        parseFloat(document.getElementById('input4').value)
    ];

    const result = network.forward(inputs);
    const [output1, output2] = result.outputs;
    
    // Display both the outputs and the direction
    document.getElementById('result').innerHTML = 
        `Output 1: ${output1.toFixed(3)}<br>` +
        `Output 2: ${output2.toFixed(3)}<br>` +
        `Direction: <strong>${output1 > output2 ? 'RIGHT' : 'LEFT'}</strong>`;
        
    // Update visualization
    drawNetwork();
}

function generateExamples() {
    // Helper function to predict output
    function predict(inputs) {
        const result = network.forward(inputs);
        return {
            inputs: inputs,
            outputs: result.outputs,
            direction: result.outputs[0] > result.outputs[1] ? 'RIGHT' : 'LEFT'
        };
    }

    // Predefined examples that will work with our fixed weights
    const rightExample = predict([1, 0, 0, 0]); // Activates first input strongly
    const leftExample = predict([0, 1, 0, 0]);  // Activates second input strongly

    // Add explanation of how the examples work
    const examplesDiv = document.getElementById('examples');
    examplesDiv.innerHTML = `
        <div class="example-box">
            <h3>Example for "RIGHT" output</h3>
            Strong activation of first input leads to RIGHT:
            <br>
            Input 1: ${rightExample.inputs[0].toFixed(3)} (High)<br>
            Input 2: ${rightExample.inputs[1].toFixed(3)} (Low)<br>
            Input 3: ${rightExample.inputs[2].toFixed(3)} (Low)<br>
            Input 4: ${rightExample.inputs[3].toFixed(3)} (Low)<br>
            <br>
            Output 1: ${rightExample.outputs[0].toFixed(3)}<br>
            Output 2: ${rightExample.outputs[1].toFixed(3)}
        </div>
        <div class="example-box">
            <h3>Example for "LEFT" output</h3>
            Strong activation of second input leads to LEFT:
            <br>
            Input 1: ${leftExample.inputs[0].toFixed(3)} (Low)<br>
            Input 2: ${leftExample.inputs[1].toFixed(3)} (High)<br>
            Input 3: ${leftExample.inputs[2].toFixed(3)} (Low)<br>
            Input 4: ${leftExample.inputs[3].toFixed(3)} (Low)<br>
            <br>
            Output 1: ${leftExample.outputs[0].toFixed(3)}<br>
            Output 2: ${leftExample.outputs[1].toFixed(3)}
        </div>
        <p style="margin-top: 20px; color: #666;">
            Try these patterns or experiment with your own combinations. 
            The network is trained to respond to different patterns in the input values.
        </p>`;
}

// Initial draw
drawNetwork();
