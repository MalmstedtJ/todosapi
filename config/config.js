module.exports = {
	secret: process.env.MONGO_SECRET || 'ThisIsADevSecret',
	prod_connString: process.env.MONGO_CONN_STRING,
	local_connString: 'mongodb://localhost:27017/winewhine'
}