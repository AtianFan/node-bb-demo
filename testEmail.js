var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'mail.ztesoft.com',
	port: 25,
	secure: true,
	debug: true,
	logger: true,
	secureConnection: true,
	auth: {
		user: 'xin.jingfen@ztesoft.com',
		pass: 'xjf-2016'
	}
});
var mailOptions = {
    from: '"xinjingfen" <xin.jingfen@ztesoft.com>', // sender address
    to: 'miao.cunzhi@ztesoft.com', // list of receivers
    subject: 'Hello', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};
// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});