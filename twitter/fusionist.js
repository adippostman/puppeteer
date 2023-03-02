import puppeteer from "puppeteer-extra";
import { executablePath } from "puppeteer";
import stealth from "puppeteer-extra-plugin-stealth";
puppeteer.use(stealth());
import readline from "readline-sync";
import UserAgent from "user-agents";

(async () => {
    const delay = (timeInMs) => {
        return new Promise((resolve) => setTimeout(resolve, timeInMs));
    };

    const targets = [
        `ZhenChao18`,
        `fusionistio`,
        `elonmusk`,
        `cz_binance`,
        `binance`,
        `Aptos_Network`,
        `VitalikButerin`,
        `solana`,
        `Cristiano`,
        `Galxe`,
        `YouTube`,
        `dogecoin`,
        `amazon`,
        `netflix`,
        `saylor`,
        `MrBeast`,
        `jack`,
        `Twitter`,
        `BillGates`,
        `Tesla`,
        `NASA`,
        `SpaceX`,
        `kucoincom`,
        `BNBCHAIN`,
        `0xPolygon`,
        `ethereum`,
    ];
    const username = readline.question("input your username: ").trim();
    const password = readline.question("input your password: ").trim();
    console.log("");

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        executablePath: executablePath(),
        args: ["--start-maximized"],
    });

    const twitterPage = await browser.newPage();
    await twitterPage.setUserAgent(
        new UserAgent({ deviceCategory: "desktop" }).toString
    );
    await twitterPage.goto("https://www.twitter.com", {
        waitUntil: "domcontentloaded",
    });

    await twitterPage
        .waitForSelector('a[role="link"][data-testid="login"]')
        .then(async (e) => {
            await e.click();
        });

    await twitterPage
        .waitForSelector('input[autocomplete="username"]')
        .then(async (e) => {
            await e.type(username, { delay: 50 });
            console.log("typing username:", username);
        });

    await twitterPage.keyboard.press("Enter");

    await twitterPage
        .waitForSelector('input[autocomplete="current-password"]', {
            timeout: 10000,
        })
        .then(async (e) => {
            await e.type(password, { delay: 60 });
            console.log("typing password:", password);
        });

    await twitterPage.keyboard.press("Enter");

    /**
     * After login page and redirect to home
     */

    await twitterPage.waitForResponse("https://twitter.com/home");
    console.log("");
    console.log("login successfully");
    console.log("");

    for (const [index, target] of targets.entries()) {
        console.log(
            `[${index + 1}/${targets.length}] going to @${target} profile ..`
        );
        const targetURL = `https://twitter.com/intent/follow?screen_name=${target}`;
        await twitterPage.goto(targetURL, { waitUntil: "networkidle2" });

        await twitterPage
            .waitForSelector('div[data-testid="confirmationSheetConfirm"]')
            .then(async (e) => {
                await delay(1000);
                await e.click({ delay: 200 });
                console.log(`youre now ${target} follower`);
            });

        await delay(3000);
        if (await twitterPage.$(`div[aria-label="Follow @${target}"]`)) {
            await twitterPage
                .$(`div[aria-label="Follow @${target}"]`)
                .then(async (e) => {
                    await e.click({ delay: 500 });
                });
        }

        if (
            await twitterPage.$(
                `div[data-testid="sheetDialog"] > div > div > div > div > div > div[role="button"]`
            )
        ) {
            await twitterPage
                .$(
                    `div[data-testid="sheetDialog"] > div > div > div > div > div > div[role="button"]`
                )
                .then(async (e) => {
                    await e.click({ delay: 500 });
                    console.log(`popup has clicked`);
                });
        }

        await twitterPage
            .waitForSelector(
                'div[role="group"] > div > div[data-testid="retweet"]'
            )
            .then(async (e) => {
                await delay(1000);
                await e.click({ delay: 500 });
            });

        // click confirm retweet
        await twitterPage
            .waitForSelector(
                'div[data-testid="Dropdown"] > div[data-testid="retweetConfirm"]',
                { timeout: 5000 }
            )
            .then(async (e) => {
                await delay(1000);
                await e.click({ delay: 200 });
                console.log(`success retweet from @${target}`);
            });

        console.log(``);
    }

    for (const cookie of await twitterPage.cookies()) {
        await twitterPage.deleteCookie(cookie);
    }
    console.log(`cookies deleted ..`);
    await browser.close();
    console.log(`browser closed`);
})();
