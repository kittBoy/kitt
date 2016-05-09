
module.exports = function initDatabase () {
	if (!this.get('db').host) {
		console.log('请设置数据库');
	}
	if (!this.get('db').database) {
		console.log('请设置数据库名称');
	}
	if (!this.get('db').protocol) {
		console.log('请设置数据库类型');
	}
	

	if (!this.get('db').pool) {
		this.get('db').pool=true;
	}
	if (!this.get('db').debug) {
		this.get('db').debug=false;
	}
	return this;
};
