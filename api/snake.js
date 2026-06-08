export default async function handler(req, res) {
    const { username } = req.query;

    if (!username) {
        return res.status(400).send('Protocol aborted: Target username missing.');
    }

    try {
        // 1. Scraping the real-time public/private contribution data array
        const response = await fetch(`https://github.com/users/${username}/contributions`);
        if (!response.ok) throw new Error('Failed to retrieve grid metrics');
        const html = await response.text();

        // Parse out total contribution string metric
        const totalMatch = html.match(/([\d,]+)\s+contributions/i);
        const totalContributions = totalMatch ? totalMatch[1] : '0';

        const dataLevelRegex = /data-level="([0-4])"/g;
        let matches = [];
        let match;
        while ((match = dataLevelRegex.exec(html)) !== null) {
            matches.push(parseInt(match[1]));
        }

        const displayDays = 70; // 10 columns/weeks
        const recentActivity = matches.slice(-displayDays);
        while (recentActivity.length < displayDays) {
            recentActivity.unshift(0);
        }

        const colorMatrix = {
            0: '#0d0d0d', 1: '#00441b', 2: '#006d2c', 3: '#238b45', 4: '#00FF66'
        };

        // 2. Build the static background data matrix squares
        let rectsSvg = '';
        const rectSize = 12;
        const gap = 3;
        const step = rectSize + gap; // 15px increment

        for (let i = 0; i < recentActivity.length; i++) {
            const col = Math.floor(i / 7);
            const row = i % 7;
            const x = col * step + 25;
            const y = row * step + 45;
            rectsSvg += `<rect x="${x}" y="${y}" width="${rectSize}" height="${rectSize}" fill="${colorMatrix[recentActivity[i]]}" rx="2" stroke="#000" stroke-width="1"/>`;
        }

        // 3. Mathematical Vector Mapping for the Snake's Crawl Path
        // This generates a continuous boustrophedon (down-and-up) looping track over the grid matrix coordinates
        let pathD = '';
        const totalCols = 10;
        
        for (let col = 0; col < totalCols; col++) {
            const cx = col * step + 25 + 6; // Center coordinate X
            if (col === 0) pathD += `M ${cx} 51 `; // Starting node position (Row 0 Center)

            if (col % 2 === 0) {
                pathD += `L ${cx} 141 `; // Slide straight down to Row 6 center
                if (col < totalCols - 1) pathD += `L ${(col + 1) * step + 31} 141 `; // Bridge to next column entry
            } else {
                pathD += `L ${cx} 51 `; // Slide straight up to Row 0 center
                if (col < totalCols - 1) pathD += `L ${(col + 1) * step + 31} 51 `; // Bridge to next column entry
            }
        }
        pathD += 'Z'; // Complete vector loop sequence back to initial node

        // 4. Forge the Interactive Mainframe Canvas Layout
        const speed = '14s'; // Duration for one full sweep across the terminal grid
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="450" height="175" viewBox="0 0 450 175">
            <style>
                .bg { fill: #000000; stroke: #00FF66; stroke-width: 2; }
                .text { font-family: 'Courier New', monospace; font-size: 14px; fill: #00FF66; font-weight: bold; }
                .dim { fill: #555555; font-size: 11px; font-family: 'Courier New', monospace; }
                .highlight { fill: #00D2FF; font-weight: bold; }
            </style>
            <rect width="100%" height="100%" class="bg" rx="6" />
            
            <text x="25" y="30" class="text">> SYSTEM_SIMULATION: SNAKE_RUNNER.EXE</text>
            <line x1="25" y1="38" x2="425" y2="38" stroke="#00FF66" stroke-width="1" stroke-dasharray="3" />
            
            ${rectsSvg}

            <g>
                <rect x="-6" y="-6" width="12" height="12" fill="#00441b" rx="2">
                    <animateMotion dur="${speed}" repeatCount="indefinite" path="${pathD}" begin="-0.2s" rotate="auto" />
                </rect>
                <rect x="-6" y="-6" width="12" height="12" fill="#238b45" rx="2">
                    <animateMotion dur="${speed}" repeatCount="indefinite" path="${pathD}" begin="-0.1s" rotate="auto" />
                </rect>
                <rect x="-6" y="-6" width="12" height="12" fill="#00FF66" rx="3" stroke="#ffffff" stroke-width="1">
                    <animateMotion dur="${speed}" repeatCount="indefinite" path="${pathD}" begin="0s" rotate="auto" />
                </rect>
            </g>

            <text x="25" y="160" class="dim">>> RUNTIME: LIVE_LOOP // TOTAL_UPLOADS_EATEN: <tspan class="highlight">${totalContributions}</tspan></text>
        </svg>
        `;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
        
        return res.status(200).send(svg);

    } catch (error) {
        console.error(error);
        return res.status(500).send('System Error: Simulation compile crash.');
    }
}
