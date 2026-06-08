export default async function handler(req, res) {
    const { username } = req.query;

    if (!username) {
        return res.status(400).send('Protocol aborted: Target username variable required.');
    }

    try {
        // 1. Query the GitHub Identity Database
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error('Identity lookup failed');
        const userData = await userRes.json();

        // 2. Scan the user's repositories to index stargazers
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const reposData = await reposRes.json();

        let totalStars = 0;
        if (Array.isArray(reposData)) {
            totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        }

        const publicRepos = userData.public_repos || 0;
        const followers = userData.followers || 0;

        // 3. Forge a custom-styled Matrix Terminal SVG
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="450" height="160" viewBox="0 0 450 160">
            <style>
                .bg { fill: #000000; stroke: #00FF66; stroke-width: 2; }
                .text { font-family: 'Courier New', monospace; font-size: 14px; fill: #00D2FF; }
                .title { font-weight: bold; fill: #00FF66; font-size: 16px; }
                .highlight { fill: #FFFFFF; font-weight: bold; }
                .dim { fill: #555555; font-size: 11px; }
            </style>
            <rect width="100%" height="100%" class="bg" rx="6" />
            
            <text x="25" y="35" class="text title">> GRID_METRICS: ${username.toUpperCase()}</text>
            <line x1="25" y1="45" x2="425" y2="45" stroke="#00FF66" stroke-width="1" stroke-dasharray="4" />
            
            <text x="25" y="75" class="text">📦 Public Modules: <tspan class="highlight">${publicRepos}</tspan></text>
            <text x="25" y="100" class="text">🌟 Star Nodes:     <tspan class="highlight">${totalStars}</tspan></text>
            <text x="25" y="125" class="text">👥 Network Nodes:  <tspan class="highlight">${followers}</tspan></text>
            
            <text x="25" y="148" class="text dim">// STATUS: UPLINK_STABLE // SECURE_NODE</text>
        </svg>
        `;

        // 4. Send headers so GitHub processes the text block as a raw image asset
        res.setHeader('Content-Type', 'image/svg+xml');
        // Cache data for 1 hour to stay safe from GitHub API rate-limiting thresholds
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        
        return res.status(200).send(svg);

    } catch (error) {
        console.error(error);
        return res.status(500).send('System Error: Infrastructure diagnostic failure.');
    }
}
