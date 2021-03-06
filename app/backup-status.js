const email = require("./email");

var backupStatus = {
    CONST_INTERVAL: 5*1000, //5 seconds
    CONST_MAX_RETRY: 6,
    i: 0,
    items: [], 
    addItem: function(name, rows = null, exported = null, uploaded = null, status = false) {
        this.items.push({
            name: name, 
            rows: rows, 
            exported: exported,
            uploaded: uploaded,
            status: status
        });
    },
    getIndex: function(name) {
        let index = this.items.findIndex(i => i.name === name);
        if (index!==-1) {
            return index;
        } else {
            throw "Index of ["+name+"] not found in array";
        }
    },
    setRows: function (name, value) {
        this.items[this.getIndex(name)].rows = value;            
    },
    setExported: function (name, value) {
        this.items[this.getIndex(name)].exported = value;
    },
    setUploaded: function (name, value) {
        this.items[this.getIndex(name)].uploaded = value;        
    },
    setStatus: function (name, value) {
        this.items[this.getIndex(name)].status = value;        
    },       
    check: function() {
        console.log('checking...');
        //array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
        return this.items.reduce((total, current) => total && current.status, true);         
    }, 
    getInfo: function() {        
        return JSON.stringify(this.items, null, 3);  
    },        
    show: function() {
        console.log('show=', JSON.stringify(this.items));
    },
    checkingStatus: function(day) { 
        //https://stackoverflow.com/questions/16875767/difference-between-this-and-self-in-javascript
        var self = this;
    console.log('checkingStatus');
    this.show();

        let status = this.check();
    console.log(">status=", status, '-', this.i, '/', this.CONST_MAX_RETRY);
        if (status === false) {
            if (this.i < this.CONST_MAX_RETRY) {
                setTimeout(function() { 
                    console.log(self.i); 
                    self.checkingStatus(day);    
                }, this.CONST_INTERVAL);
                this.i++;
            } else {
                console.log('Send email NOT DONE');
                email.sendEmail('[Error] Geoloc backup of '+day, this.getInfo());
                this.items.length = 0; //clear array
            }
        } else {
            console.log('Send email OK'); 
            email.sendEmail('[OK] Geoloc backup of '+day, this.getInfo());
            this.items.length = 0; //clear array
        }
    }
};

module.exports = backupStatus;
