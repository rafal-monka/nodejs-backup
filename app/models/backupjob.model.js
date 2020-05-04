//testjob
module.exports = (sequelize, Sequelize) => {
    const BackupJob = sequelize.define("backupjob", {
      what: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER(10),
        allowNull: false
      },     
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false 
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true 
      }
    });
  
    return BackupJob;
  };