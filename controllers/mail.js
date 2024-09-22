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
        const unreadCount = await Mail.countDocuments({ read: false });
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
        res.status(200).json({mailsWithSenders, unreadCount});
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

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const mail = await Mail.findOneAndUpdate(
            { _id: id, to: req.user._id },
            { read: true },
        );
        if (!mail) {
            return res.status(404).json({ message: 'Mail not found' });
        }
        res.status(200).json(mail);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteMail = async (req, res) => {
    try {
        const { id } = req.params;
        const mail = await Mail.findOneAndDelete({ _id: id, to: req.user._id });
        if (!mail) {
            return res.status(404).json({ message: 'Mail not found' });
        }
        res.status(200).json({ message: 'Mail deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.sentMails = async (req, res) => {
    try {
        const mails = await Mail.find({ from: req.user._id });
        const recipientIds = mails.map(mail => mail.to);
        const recipients = await User.find({ _id: { $in: recipientIds } });
        const recipientMap = {};
        recipients.forEach(recipient => {
            recipientMap[recipient._id] = recipient.email;
        });
        const mailsWithRecipients = mails.map(mail => ({
            ...mail.toObject(),
            recipient: recipientMap[mail.to]
        }));
        res.status(200).json(mailsWithRecipients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.sentMailDetails = async (req, res) => {
    try {
        const mail = await Mail.findOne({ _id: req.params.id, from: req.user._id });
        if (!mail) {
            return res.status(404).json({ message: 'Mail not found' });
        }
        const recipient = await User.findById(mail.to);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }
        const mailWithRecipient = {
            ...mail.toObject(),
            recipient: recipient.email
        };
        res.status(200).json(mailWithRecipient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
