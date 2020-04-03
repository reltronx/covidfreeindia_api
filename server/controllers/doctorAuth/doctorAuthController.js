const jwt = require('jsonwebtoken');

const Doctor = require('../../models/Doctor.js');

module.exports = {
	doctorLogin: (req, res) => {
		const { username, password } = req.body;
		Doctor.findOne({ username }, function(err, doctor) {
			if (err) {
				console.error(err);
				res.status(500).json({ 
					error: 'Internal error please try again'
				});
			} else if (!doctor) {
				res.status(401).json({
					error: 'Incorrect username or password'
				});
			} else {
				doctor.isCorrectPassword(password, function(err, same) {
					console.log('bcrypting pass', same);
					if (err) {
						res.status(500).json({
							error: 'Internal error please try again'
						});
					} else if (!same) {
						res.status(401).json({
							error: 'Incorrect username or password'
						});
					} else {
						// Issue token
						const payload = { username };
						const secret = process.env.JWT_SECRET;
						const token = jwt.sign(payload, secret, {
							expiresIn: '1h'
						});
						// res.cookie('token', token, { httpOnly: true }).sendStatus(200)
						res.status(200).json({ message: 'success',user: doctor, token });
					}
				});
			}
		});
	},
	patientSignup: (req, res) => {
		console.log('register is hit', req.body);
		const { username, province, phone, password } = req.body;
		// console.log("data",username,province,phone,password)
		const newPatient = new Doctor({ username, province, phone, password });

		Doctor.findOne({ username }, function(err, doctor) {
			if (err) {
				console.error(err);
				res.status(500).json({
					error: 'Internal error please try again'
				});
			} else if (doctor) {
				res.status(200).json({
					error: 'User Already has registered'
				});
			} else
				newPatient.save(function(err, user) {
					if (err) {
						res.status(500).send('Error registering new doctor please try again.');
					} else {
						res.status(200).json({ user });
					}
				});
		});
	}
};
