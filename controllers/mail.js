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

}
