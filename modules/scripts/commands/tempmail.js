const { TempMail } = require("1secmail-api");

function generateRandomId() {
    var length = 6;
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var randomId = '';

    for (var i = 0; i < length; i++) {
        randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return randomId;
}

module.exports.config = {
    name: "tempmail",
    author: "Deku",
    version: "1.0",
    category: "utility",
    description: "Generate temporary email (auto get inbox)",
    adminOnly: false,
    usePrefix: false,
    cooldown: 5,
};

module.exports["run"] = async ({ event, args }) => {
    const senderId = event.sender.id;

    const sendMessage = (msg) => {
        api.sendMessage(msg, senderId);
    };

    try {
        const mail = new TempMail(generateRandomId());

        mail.autoFetch();

        if (mail) {
            sendMessage(
                "Your temporary email: " + mail.address + 
                "\n\nNote: The tempmail code is automatically processed if you use the email to create an account in Facebook."
            );
        }

        const fetch = () => {
            mail.getMail().then((mails) => {
                if (!mails[0]) {
                    return;
                } else {
                    let b = mails[0];
                    const msg = `You have a message!\n\nFrom: ${b.from}\n\nSubject: ${b.subject}\n\nMessage: ${b.textBody}\nDate: ${b.date}`;
                    sendMessage(
                        msg + "\n\nOnce the email and message are received, they will be automatically deleted."
                    );
                    return mail.deleteMail();
                }
            });
        };

        fetch();
        setInterval(fetch, 3 * 1000);
    } catch (err) {
        sendMessage(err.message);
    }
};
