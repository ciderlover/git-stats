export default async function handler(req, res) {
    const { username } = req.query;

    if (!username) {
        return res.status(400).send('Protocol aborted: Target username missing.');
    }

    try {
        // 1. Fetch the raw public contribution index from GitHub
        const response = await fetch(`https://github.com/users/${username}/contributions`);
        if (!response.ok) throw new Error('Failed to retrieve grid metrics');
        
        const html = await response.text();

        // 2. Parse out the activity levels using a local string scan
        const dataLevelRegex = /data-level="([0-4])"/g;
        let matches = [];
        let match;
        
        while ((match = dataLevelRegex.exec(html)) !== null) {
            matches.push(parseInt(match[1]));
        }

        // Slice out the last 70 days (10 weeks) of telemetry arrays
        const displayDays = 70;
        const recentActivity = matches.slice(-displayDays);

        // Fill empty indices if account profile has sparse matrix history
        while (recentActivity.length < displayDays) {
            recentActivity.unshift(0);
        }

        // 3. Calibrate the Neon Cyberpunk Color Schemes
        const colorMatrix = {
            0: '#0d0d0d', // Inactive Node (Near Black)
            1: '#00441b', // Low Activity
            2: '#006d2c', // Medium Activity
            3: '#238b45', // High Activity
            4: '#00FF66'  // Critical Upload (Neon Matrix Green)
        };

        // 4. Forge the Dynamic Grid SVG Layout
        let rectsSvg = '';
        const rectSize = 12;
        const gap = 3;

        for (let i = 0; i < recentActivity.length; i++) {
            const level = recentActivity[i];
            const color = colorMatrix[level];

            // Organize blocks into columns of 7 (Sunday through Saturday)
            const col = Math.floor(i / 7);
            const row = i % 7;

            const x = col * (rectSize + gap) + 25;
            const y = row * (rectSize + gap) + 45;

            // Inject an incremental fade-in animation delay per column for visual flare
            const delay = (col * 0.1).toFixed(1);

            rectsSvg += `
            <rect x="${x}" y="${y}" width="${rectSize}" height="${rectSize}" fill="${color}" stroke="#000000" stroke-width="1" rx="2">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" begin="${delay}s" repeatCount="indefinite" />
            </rect>`;
        }

        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="450" height="170" viewBox="0 0 450 170">
            <style>
                .bg { fill: #000000; stroke: #00FF66; stroke-width: 2; }
                .text { font-family: 'Courier New', monospace; font-size: 14px; fill: #00FF66; font-weight: bold; }
                .dim { fill: #555555; font-size: 11px; font-family: 'Courier New', monospace; }
            </style>
            <rect width="100%" height="100%" class="bg" rx="6" />
            
            <text x="25" y="30" class="text">> CONTRIBUTION_FLOW: LOCAL_MATRIX_GRID</text>
            <line x1="25" y1="38" x2="425" y2="38" stroke="#00FF66" stroke-width="1" stroke-dasharray="3" />
            
            ${rectsSvg}

            <text x="25" y="158" class="dim">>> DISPLAY_WINDOW: PAST_10_WEEKS // ACTIVITY_STREAM_ON</text>
        </svg>
        `;

        // 5. Transmit standard image caching protocols
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
        
        return res.status(200).send(svg);

    } catch (error) {
        console.error(error);
        return res.status(500).send('System Error: Matrix array compilation failure.');
    }
}
