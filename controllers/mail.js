const Mail = require("../models/mail");
const User = require("../models/user");

exports.send = async (req, res) => {
    try {
        const { to, subject, body } = req.body;

        const recipient = await User.findOne({ email: to });
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        const mail = new Mail({
            from: req.user._id,
            to: recipient._id,
            subject,
            body,
        });
        
        await mail.save();
        res.status(201).json({ message: 'Mail sent successfully', mail });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.inbox = async (req, res) => {
    try {
        const mails = await Mail.find({ to: req.user._id });
        const senderIds = mails.map(mail => mail.from);
        const senders = await User.find({ _id: { $in: senderIds } });
        const senderMap = {};
        senders.forEach(sender => {
            senderMap[sender._id] = sender.email;
        });
        const mailsWithSenders = mails.map(mail => ({
            ...mail.toObject(),
            sender: senderMap[mail.from]
        }));
        res.status(200).json(mailsWithSenders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.mailDetails = async (req, res) => {
    try {
        const mail = await Mail.findOne({ _id: req.params.id, to: req.user._id });
        if (!mail) {
            return res.status(404).json({ message: 'Mail not found' });
        }
        const sender = await User.findById(mail.from);
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }
        const mailWithSender = {
            ...mail.toObject(),
            sender: sender.email
        };
        res.status(200).json(mailWithSender);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
