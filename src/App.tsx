import { Client, GatewayIntentBits } from 'discord.js';
import { google } from 'googleapis';

// Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Google Sheets auth
const auth = new google.auth.GoogleAuth({
  keyFile: 'rotectionbot-credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '1vnfl7ZgdzemBor01ygDHWS0R276Q4OMSy74zF4e8rBY';

// Ready
client.on('ready', () => console.log(`Logged in as ${client.user?.tag}`));

// Message handler
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // -------- !addgame --------
  if (message.content.startsWith('!addgame')) {
    const args = message.content.slice('!addgame'.length).trim().split('|').map(s => s.trim());
    if (args.length < 6)
      return message.reply('Format: `!addgame Game Title | Creators | Description | Age Group | Category | Game Link`');

    const [title, creators, description, ageGroup, category, link] = args;
    const thumbnail = getThumbnail(link);

    try {
      const existing = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'Games!A:A' });
      const gamesList = existing.data.values?.map(r => r[0].toLowerCase()) || [];
      if (gamesList.includes(title.toLowerCase())) return message.reply('Game already exists.');

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Games!A:N',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            title, creators, description, ageGroup, category, link,
            0,0,0,0,0, thumbnail, 0, false
          ]]
        }
      });
      message.reply(`Game "${title}" added!`);
    } catch(e) { console.error(e); message.reply('Failed to add game.'); }
  }

  // -------- !rate --------
  if (message.content.startsWith('!rate')) {
    const args = message.content.slice('!rate'.length).trim().split('|').map(s => s.trim());
    if (args.length < 5) return message.reply('Format: `!rate Game Title | 5 | 4 | 3 | 5`');

    const gameName = args[0];
    const [honesty, safety, fairness, age] = args.slice(1).map(Number);
    if ([honesty,safety,fairness,age].some(n=>isNaN(n)||n<0||n>5))
      return message.reply('Ratings must be 0–5.');

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Ratings!A:E',
        valueInputOption: 'RAW',
        requestBody: { values:[[gameName,honesty,safety,fairness,age]] }
      });

      const ratingsData = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'Ratings!A:E' });
      const gameRatings = ratingsData.data.values?.filter(r=>r[0].toLowerCase()===gameName.toLowerCase())||[];

      const avg = (i:number)=>gameRatings.reduce((sum,row)=>sum+Number(row[i]),0)/gameRatings.length;
      const [honestyAvg,safetyAvg,fairnessAvg,ageAvg] = [avg(1),avg(2),avg(3),avg(4)];
      const totalRatings = gameRatings.length;

      const gamesSheet = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'Games!A:N' });
      const rowIndex = gamesSheet.data.values?.findIndex(r=>r[0].toLowerCase()===gameName.toLowerCase());
      if(rowIndex===undefined||rowIndex<0) return message.reply('Game not found.');

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range:`Games!G${rowIndex+1}:K${rowIndex+1}`,
        valueInputOption:'RAW',
        requestBody:{ values:[[honestyAvg,safetyAvg,fairnessAvg,ageAvg,totalRatings]] }
      });

      message.reply(`Rating recorded for "${gameName}"!`);
    } catch(e){console.error(e);message.reply('Failed to record rating.');}
  }
});

// Auto thumbnail logic
function getThumbnail(link:string){
  // Roblox place link
  if(link.includes('roblox.com/games/')) return `https://tr.rbxcdn.com/${extractPlaceId(link)}/768/432/Image/Webp/noFilter`;
  // YouTube video
  if(link.includes('youtube.com')||link.includes('youtu.be')) return `https://img.youtube.com/vi/${extractYouTubeID(link)}/hqdefault.jpg`;
  // Fallback
  return '';
}

function extractPlaceId(link:string){ const match = link.match(/\/games\/(\d+)/); return match?match[1]:'0'; }
function extractYouTubeID(link:string){ const match = link.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/); return match?match[1]:''; }

// Discord bot token
client.login('YOUR_BOT_TOKEN_HERE');
