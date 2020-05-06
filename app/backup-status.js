var backupStatus = {
    i: 0,
    maxi: 3,
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
        //this.show();
        //array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
        return this.items.reduce((total, current) => total && current.status, true);         
    }, 
    getInfo: function() {
        return JSON.stringify(this.items, null, 3);  
    },        
    show: function() {
        console.log('show=', this.getInfo());
    }
};

module.exports = backupStatus;