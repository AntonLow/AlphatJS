const Command = require('./command');
const { Message, OpType, Location, Profile } = require('../curve-thrift/line_types');

class LINE extends Command {
    constructor() {
        super();
        this.receiverID = '';
        this.checkReader = [];
        this.stateStatus = {
            cancel: 0,
            kick: 0,
        };
        this.messages;
        this.payload;
        this.stateUpload =  {
                file: '',
                name: '',
                group: '',
                sender: ''
            }
    }


    get myBot() {
        const bot = ['u813e54635fa8ca8c016090e933582652'];
        return bot; 
    }

    isAdminOrBot(param) {
        return this.myBot.includes(param);
    }

    getOprationType(operations) {
        for (let key in OpType) {
            if(operations.type == OpType[key]) {
                if(key !== 'NOTIFIED_UPDATE_PROFILE') {
                    console.info(`[* ${operations.type} ] ${key} `);
                }
            }
        }
    }

    poll(operation) {
        if(operation.type == 25 || operation.type == 26) {
            let message = new Message(operation.message);
            this.receiverID = message.to = (operation.message.to === this.myBot[0]) ? operation.message.from : operation.message.to ;
            Object.assign(message,{ ct: operation.createdTime.toString() });
            this.textMessage(message)
        }

        if(operation.type == 13 && this.stateStatus.cancel == 1) {
            this._cancel(operation.param2,operation.param1);
            
        }

        if(operation.type == 11 && !this.isAdminOrBot(operation.param2) && this.stateStatus.qrp == 1) {
            this._kickMember(operation.param1,[operation.param2]);
            this.messages.to = operation.param1;
            this.qrOpenClose();
        }


        if(operation.type == 55){ //ada reader
            const idx = this.checkReader.findIndex((v) => {
                if(v.group == operation.param1) {
                    return v
                }
            })
            if(this.checkReader.length < 1 || idx == -1) {
                this.checkReader.push({ group: operation.param1, users: [operation.param2], timeSeen: [operation.param3] });
            } else {
                for (var i = 0; i < this.checkReader.length; i++) {
                    if(this.checkReader[i].group == operation.param1) {
                        if(!this.checkReader[i].users.includes(operation.param2)) {
                            this.checkReader[i].users.push(operation.param2);
                            this.checkReader[i].timeSeen.push(operation.param3);
                        }
                    }
                }
            }
        }
        
    
    command(msg, reply) {
        if(this.messages.text !== null) {
            if(this.messages.text === msg.trim()) {
                if(typeof reply === 'function') {
                    reply();
                    return;
                }
                if(Array.isArray(reply)) {
                    reply.map((v) => {
                        this._sendMessage(this.messages, v);
                    })
                    return;
                }
                return this._sendMessage(this.messages, reply);
            }
        }
    }

    async textMessage(messages) {
        this.messages = messages;
        let payload = (this.messages.text !== null) ? this.messages.text.split(' ').splice(1).join(' ') : '' ;
        let receiver = messages.to;
        let sender = messages.from;
        

        this.command('Me', this.getProfile.bind(this));
        this.command('Status', `Your Status: ${JSON.stringify(this.stateStatus)}`);
        this.command(`Left ${payload}`, this.leftGroupByName.bind(this));
        this.command('Speed', this.getSpeed.bind(this));
        this.command('Kernel', this.checkKernel.bind(this));
        this.command(`Kick ${payload}`, this.OnOff.bind(this));
        this.command(`Cancel ${payload}`, this.OnOff.bind(this));
        this.command(`Qrp ${payload}`, this.OnOff.bind(this));
        this.command(`Serang ${payload}`,this.kickAll.bind(this));
        this.command(`Dobol ${payload}`, this.cancelMember.bind(this));
        this.command(`Set`,this.setReader.bind(this));
        this.command(`Cctv`,this.setReaderrr.bind(this));
        this.command(`Recheck`,this.rechecks.bind(this));
        this.command(`Check`,this.rechecksss.bind(this));
        this.command(`Read`,this.recheckssss.bind(this));
        this.command(`check sider`,this.recheck.bind(this));
        this.command(`Reset`,this.reset.bind(this));
        this.command('Myid',`Your ID: ${messages.from}`)
        this.command(`Ip ${payload}`,this.checkIP.bind(this))
        this.command(`Ig ${payload}`,this.checkIG.bind(this))
        this.command(`Qr ${payload}`,this.qrOpenClose.bind(this))
        this.command(`Joinqr ${payload}`,this.joinQr.bind(this));
        this.command(`Spam ${payload}`,this.spam2.bind(this));
        this.command(`Spam group ${payload}`,this.spamGroup.bind(this));
        this.command(`Creator`,this.creator.bind(this));
        this.command(`List admin`,this.list.bind(this));
        this.command(`Admin`,this.admin1.bind(this));
        this.command(`Pap ${payload}`,this.searchLocalImage.bind(this));
        this.command(`Upload ${payload}`,this.prepareUpload.bind(this));
        this.command(`Desah`,this.tagall.bind(this));
        this.command(`Tagall`,this.tagall1.bind(this));
        this.command(`Help`,this.help.bind(this));
        this.command(`Play`,this.lagu.bind(this));
        this.command(`Vn`,this.vn.bind(this));
        this.command(`List lagu1`,this.listlagu1.bind(this));
        this.command(`List lagu2`,this.listlagu2.bind(this));


        if(messages.contentType == 13) {
            messages.contentType = 0;
            if(!this.isAdminOrBot(messages.contentMetadata.mid)) {
                this._sendMessage(messages,messages.contentMetadata.mid);
            }
            return;
        }

  if (messages.text == 'Gift'){
        messages.contentType = 0;
       if(!this.isAdminOrBot(messages.contentMetadata.mid)) {
       this._sendMessage(messages, "gift sent",messages.contentMetadata=null,messages.contentType=9);
       }
       return;
       }


  if (messages.text == 'Silahkan'){
               await this._sendMessage(messages,'Reinvite -,-');
     {
this._leaveGroup(this.messages.to);
     }
     }

        if(this.stateUpload.group == messages.to && [1,2,3].includes(messages.contentType)) {
            if(sender === this.stateUpload.sender) {
                this.doUpload(messages);
                return;
            } else {
                messages.contentType = 0;
                this._sendMessage(messages,'Wrong Sender! Reseted');
            }
            this.resetStateUpload();
            return;
        }

        // if(cmd == 'lirik') {
        //     let lyrics = await this._searchLyrics(payload);
        //     this._sendMessage(seq,lyrics);
        // }

    }

}

module.exports = LINE;
