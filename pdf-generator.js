const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
const axios = require('axios');

async function createPDF(data, templatUrl) {
	try {
		const response = await axios.get(templatUrl)
		console.log(response.data);
		//console.log(response.data.explanation);
		var templateHtml = response.data;
		var template = handlebars.compile(templateHtml);
		var html = template(data);

		var milis = new Date();
		milis = milis.getTime();
		const dir = 'pdf';
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		var pdfPath = path.join('pdf', `${data.name}-${milis}.pdf`);

		var options = {
			displayHeaderFooter: false,
			margin: {
				top: "0px",
				bottom: "0px"
			},
			printBackground: true,
			path: pdfPath,
			format: 'A4'
		}

		const browser = await puppeteer.launch({
			args: ['--no-sandbox'],
			headless: true
		});

		var page = await browser.newPage();

		await page.goto(`data:text/html;charset=UTF-8,${html}`, {
			waitUntil: 'networkidle0'
		});

		const res = await page.pdf(options);
		await browser.close();
		return res;
	} catch (error) {
		console.log(error);
		throw error
	}

}
/* 
const data = {
	title: "A new Brazilian School",
	date: "05/12/2018",
	name: "Rodolfo Luis Marcos",
	age: 28,
	birthdate: "12/07/1990",
	course: "Computer Science",
	obs: "Graduated in 2014 by Federal University of Lavras, work with Full-Stack development and E-commerce."
}

createPDF(data); */

exports.createPDF = createPDF;