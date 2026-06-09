export default async function handler(req, res) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="560" height="155" viewBox="0 0 560 155">
        <style>
            .bg { fill: #000000; stroke: #00FF66; stroke-width: 2; }
            .logo { font-family: 'Courier New', monospace; font-size: 13px; fill: #00FF66; font-weight: bold; white-space: pre; }
            .label { font-family: 'Courier New', monospace; font-size: 13px; fill: #00D2FF; font-weight: bold; }
            .value { fill: #FFFFFF; font-weight: normal; }
            .header { font-family: 'Courier New', monospace; font-size: 14px; fill: #00FF66; font-weight: bold; letter-spacing: 1px; }
            .line { stroke: #333333; stroke-width: 1; }
        </style>
        <rect width="100%" height="100%" class="bg" rx="6" />

        <g transform="translate(10, 0)">
            <text x="15" y="25" class="logo">       /\\       </text>
            <text x="15" y="41" class="logo">      /  \\      </text>
            <text x="15" y="57" class="logo">     /\\  /\\     </text>
            <text x="15" y="73" class="logo">    /  \\/  \\    </text>
            <text x="15" y="89" class="logo">   /   ||   \\   </text>
            <text x="15" y="105" class="logo">  /    ||    \\  </text>
            <text x="15" y="121" class="logo"> /_____||_____\\ </text>
            <text x="15" y="137" class="logo">[==============]</text>
        </g>

        <g transform="translate(180, 0)">
            <text x="0" y="30" class="header">BILL@MAINFRAME</text>
            <line x1="0" y1="38" x2="130" y2="38" class="line" />

            <text x="0" y="58" class="label">OS:      <tspan class="value">Windows 11 / Android</tspan></text>
            <text x="0" y="76" class="label">KERNEL:  <tspan class="value">Node.js / Vercel_Serverless</tspan></text>
            <text x="0" y="94" class="label">UPTIME:  <tspan class="value">100% (No-Crash Framework)</tspan></text>
            <text x="0" y="112" class="label">SHELL:   <tspan class="value">Bash / Powershell</tspan></text>
            <text x="0" y="130" class="label">CONFIG:  <tspan class="value">Sublime Text 4 / Prism_Launcher</tspan></text>
        </g>
    </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    
    return res.status(200).send(svg);
}
