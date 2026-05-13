const WEBHOOK_URL = "https://n8n.srv1474318.hstgr.cloud/webhook-test/all-inf-to-CRM-finademica";

const user = {
    auth_user_id: "711879fa-2c2d-4438-bbb2-3e9a4e4cf773",
    user_id: "petr-pleva-uuid-123",
    email: "callin.cz@gmail.com",
    phone: "+420 777 777 777",
    first_name: "Petr",
    last_name: "Pleva",
    role: "learner",
    client_id: "a6151fd9-1513-4ae0-b960-25454f3a9bf2",
    broker_key: "finademica_mt5"
};

const context = {
    page: "/dashboard",
    device: "desktop",
    locale: "cs-CZ",
    ip: "127.0.0.1"
};

async function sendEvent(eventName, actionData) {
    const payload = {
        event_name: eventName,
        occurred_at: new Date().toISOString(),
        source: "simulation_script",
        app: "Finademica Academy",
        environment: "testing",
        user,
        action: {
            type: eventName,
            entity: actionData.entity,
            entity_id: actionData.entity_id || null,
            data: actionData.data
        },
        context
    };

    console.log(`Sending ${eventName}...`);
    const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        console.log(`✅ ${eventName} sent!`);
    } else {
        console.error(`❌ ${eventName} failed: ${response.status}`);
    }
}

async function runSimulation() {
    // 1. Login
    await sendEvent("user_login", {
        entity: "session",
        data: { login_method: "password", redirected_from: null }
    });

    // 2. Video Completed
    await sendEvent("video_completed", {
        entity: "video",
        entity_id: "video-123-abc",
        data: { 
            video_id: "video-123-abc", 
            video_title: "Introduction to Forex Mastery", 
            completion_percent: 100 
        }
    });

    // 3. Calculator Used
    await sendEvent("calculator_used", {
        entity: "trade_calculation",
        data: {
            symbol: "EURUSD",
            side: "buy",
            entry_price: 1.0850,
            stop_loss_price: 1.0820,
            risk_total_usd: 100,
            lots_final: 0.33
        }
    });

    // 4. Diary Trade Saved
    await sendEvent("diary_trade_saved", {
        entity: "trading_diary_trades",
        entity_id: "trade-789",
        data: {
            trade_id: "trade-789",
            symbol: "GBPUSD",
            side: "sell",
            profit_total_usd: 250,
            status: "closed",
            notes: "Perfect entry on the 15m breakout."
        }
    });

    // 5. Mentor Message Sent
    await sendEvent("mentor_message_sent", {
        entity: "mentor_messages",
        data: {
            role: "user",
            content: "Hey, can you explain what a stop loss is?",
            conversation_id: "conv-999"
        }
    });

    console.log("\n✨ All simulation events completed!");
}

runSimulation();
