const LineAPI = require('./api');

let exec = require('child_process').exec;

class Command extends LineAPI {

    constructor() {
        super();
        this.spamName = [];
    }

    get payload() {
        if(typeof this.messages !== 'undefined'){
            return (this.messages.text !== null) ? this.messages.text.split(' ').splice(1) : '' ;
        }
        return false;
    }

    async getProfile() {
        let { displayName } = await this._myProfile();
        return displayName;
    }


    async cancelMember() {
        let groupID;
        if(this.payload.length > 0) {
            let [ groups ] = await this._findGroupByName(this.payload.join(' '));
            groupID = groups.id;
        } 
        let gid = groupID || this.messages.to;
        let { listPendingInvite } = await this.searchGroup(gid);
        if(listPendingInvite.length > 0){
            this._cancel(gid,listPendingInvite);
        }
    }

    async searchGroup(gid) {
        let listPendingInvite = [];
        let thisgroup = await this._getGroups([gid]);
        if(thisgroup[0].invitee !== null) {
            listPendingInvite = thisgroup[0].invitee.map((key) => {
                return key.mid;
            });
        }
        let listMember = thisgroup[0].members.map((key) => {
            return { mid: key.mid, dn: key.displayName };
        });

        return { 
            listMember,
            listPendingInvite
        }
    }

    OnOff() {
        if(this.isAdminOrBot(this.messages.from)){
            let [ actions , status ] = this.messages.text.split(' ');
            const action = actions.toLowerCase();
            const state = status.toLowerCase() == 'on' ? 1 : 0;
            this.stateStatus[action] = state;
            this._sendMessage(this.messages,`Status: \n${JSON.stringify(this.stateStatus)}`);
        } 
        Object.assign(this.messages,msg);
        this._sendMessage(this.messages);
    }

    mention(listMember) {
        if(this.isAdminOrBot(this.messages.from)){
        let mentionStrings = [''];
        let mid = [''];
        for (var i = 0; i < listMember.length; i++) {
            mentionStrings.push('@'+listMember[i].displayName+'\n');
            mid.push(listMember[i].mid);
        }
        let strings = mentionStrings.join('');
        let member = strings.split('@').slice(1);
        
        let tmp = 0;
        let memberStart = [];
        let mentionMember = member.map((v,k) => {
            let z = tmp += v.length + 1;
            let end = z - 1;
            memberStart.push(end);
            let mentionz = `{"S":"${(isNaN(memberStart[k - 1] + 1) ? 0 : memberStart[k - 1] + 1 ) }","E":"${end}","M":"${mid[k + 1]}"}`;
            return mentionz;
        })
        }
        return {
            names: mentionStrings.slice(1),
            cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }
        }
    }

    async leftGroupByName(name) {
        if(this.isAdminOrBot(this.messages.from)){
        let payload = name || this.payload.join(' ');
        let gid = await this._findGroupByName(payload);
        for (let i = 0; i < gid.length; i++) {
            this._leaveGroup(gid[i].id);
        }
        }
        return;
    }

    async recheck(cs,group) {
        if(this.isAdminOrBot(this.messages.from)){
        let users;
        for (var i = 0; i < cs.length; i++) {
            if(cs[i].group == group) {
                users = cs[i].users;
            }
        }
        
        let contactMember = await this._getContacts(users);
        return contactMember.map((z) => {
        }    
            return { displayName: z.displayName, mid: z.mid };
            });
    }

    removeReaderByGroup(groupID) {
        const groupIndex = this.checkReader.findIndex(v => {
            if(v.group == groupID) {
                return v
            }
        })

        if(groupIndex != -1) {
            this.checkReader.splice(groupIndex,1);
        }
    }

    async getSpeed() {
        if(this.isAdminOrBot(this.messages.from)){
        let curTime = Date.now() / 1000;
        await this._sendMessage(this.messages, 'Checking server speed...');
        await this._sendMessage(this.messages, `0.000212 Second`);
        }
        return;
    }

    async tagall() {
        if(this.isAdminOrBot(this.messages.from)){
        let rec = await this._getGroup(this.messages.to);
        const mentions = await this.mention(rec.members);
        this.messages.contentMetadata = mentions.cmddata;
        await this._sendMessage(this.messages,mentions.names.join(''));
        }
        return;
    }

    async tagall1() {
        if(this.isAdminOrBot(this.messages.from)){
        let rec = await this._getGroup(this.messages.to);
        const mentions = await this.mention(rec.members);
        this.messages.contentMetadata = mentions.cmddata;
        await this._sendMessage(this.messages,mentions.names.join(''));
        }
        return;
    }

    vn() {
        this._sendFile(this.messages,`${__dirname}/../download/${this.payload.join(' ')}.m4a`,3);
    }

    lagu() {
     {
        this._sendFile(this.messages,`${__dirname}/../download/${this.payload.join(' ')}.m4a`,3);
    }
    {
        this._sendMessage(this.messages, `Ok, Sabar Ya Kak, Tungguin... Lagu Kakak Lagi Aku Prosses ^_^`);
    }
    }

    checkKernel() {
        exec('uname -a',(err, sto) => {
            if(err) {
                this._sendMessage(this.messages, err);
                return
            }
            this._sendMessage(this.messages, sto);
            return;
        });
    }

    setReader() {
        if(this.isAdminOrBot(this.messages.from)){
        this._sendMessage(this.messages, `Set last point...`);
        this._sendMessage(this.messages, `Ketik "Recheck" untuk melihat sider!`);
        this.removeReaderByGroup(this.messages.to);
        }
        return;
    }

    setReaderrr() {
        if(this.isAdminOrBot(this.messages.from)){
        this._sendMessage(this.messages, `Set last point...`);
        this._sendMessage(this.messages, `Ketik "Recheck" untuk melihat sider!`);
        this.removeReaderByGroup(this.messages.to);
        }
        return;
    }

    spam2() {
                    if(this.isAdminOrBot(this.messages.from)){
                    this._sendMessage(this.messages, `Ku mengejar bus yang mulai berjalan`);
                    this._sendMessage(this.messages, `Ku ingin ungkapkan kepada dirimu`);
                    this._sendMessage(this.messages, `Kabut dalam hatiku telah menghilang`);
                    this._sendMessage(this.messages, `Dan hal yang penting bagiku pun terlihat`);
                    this._sendMessage(this.messages, `Walaupun jawaban itu sebenarnya begitu mudah`);
                    this._sendMessage(this.messages, `Tetapi entah mengapa diriku melewatkannya`);
                    this._sendMessage(this.messages, `Untukku menjadi diri sendiri`);
                    this._sendMessage(this.messages, `Ku harus jujur, pada perasaanku`);
                    this._sendMessage(this.messages, `Ku suka dirimu ku suka`);
                    this._sendMessage(this.messages, `Ku berlari sekuat tenaga`);
                    this._sendMessage(this.messages, `Ku suka selalu ku suka`);
                    this._sendMessage(this.messages, `Ku teriak sebisa suaraku`);
                    this._sendMessage(this.messages, `Ku suka dirimu ku suka`);
                    this._sendMessage(this.messages, `Walau susah untukku bernapas`);
                    this._sendMessage(this.messages, `Tak akan ku sembunyikan`);
                    this._sendMessage(this.messages, `Oogoe daiyamondo~`);
                    this._sendMessage(this.messages, `Saat ku sadari sesuatu menghilang`);
                    this._sendMessage(this.messages, `Hati ini pun resah tidak tertahankan`);
                    this._sendMessage(this.messages, `Sekarang juga yang bisa ku lakukan`);
                    this._sendMessage(this.messages, `Merubah perasaan ke dalam kata kata`);
                    this._sendMessage(this.messages, `Mengapa sedari tadi`);
                    this._sendMessage(this.messages, `Aku hanya menatap langit`);
                    this._sendMessage(this.messages, `Mataku berkaca kaca`);
                    this._sendMessage(this.messages, `Berlinang tak bisa berhenti`);
                    this._sendMessage(this.messages, `Di tempat kita tinggal, didunia ini`);
                    this._sendMessage(this.messages, `Dipenuhi cinta, kepada seseorang`);
                    this._sendMessage(this.messages, `Ku yakin ooo ku yakin`);
                    this._sendMessage(this.messages, `Janji tak lepas dirimu lagi`);
                    this._sendMessage(this.messages, `Ku yakin ooo ku yakin`);
                    this._sendMessage(this.messages, `Akhirnya kita bisa bertemu`);
                    this._sendMessage(this.messages, `Ku yakin ooo ku yakin`);
                    this._sendMessage(this.messages, `Ku akan bahagiakan dirimu`);
                    this._sendMessage(this.messages, `Ku ingin kau mendengarkan`);
                    this._sendMessage(this.messages, `Oogoe daiyamondo~`);
                    this._sendMessage(this.messages, `Jika jika kamu ragu`);
                    this._sendMessage(this.messages, `Takkan bisa memulai apapun`);
                    this._sendMessage(this.messages, `Ungkapkan perasaanmu`);
                    this._sendMessage(this.messages, `Jujurlah dari sekarang juga`);
                    this._sendMessage(this.messages, `Jika kau bersuar`);
                    this._sendMessage(this.messages, `Cahaya kan bersinar`);
                    this._sendMessage(this.messages, `Ku suka dirimu ku suka`);
                    this._sendMessage(this.messages, `Ku berlari sekuat tenaga`);
                    this._sendMessage(this.messages, `Ku suka selalu ku suka`);
                    this._sendMessage(this.messages, `Ku teriak sebisa suaraku`);
                    this._sendMessage(this.messages, `Ku suka dirimu ku suka`);
                    this._sendMessage(this.messages, `Sampaikan rasa sayangku ini`);
                    this._sendMessage(this.messages, `Ku suka selalu ku suka`);
                    this._sendMessage(this.messages, `Ku teriakkan ditengah angin`);
                    this._sendMessage(this.messages, `Ku suka dirimu ku suka`);
                    this._sendMessage(this.messages, `Walau susah untuk ku bernapas`);
                    this._sendMessage(this.messages, `Tak akan ku sembunyikan`);
                    this._sendMessage(this.messages, `Oogoe daiyamondo~`);
                    this._sendMessage(this.messages, `Katakan dengan berani`);
                    this._sendMessage(this.messages, `Jika kau diam kan tetap sama`);
                    this._sendMessage(this.messages, `Janganlah kau merasa malu`);
                    this._sendMessage(this.messages, `“Suka” itu kata paling hebat!`);
                    this._sendMessage(this.messages, `“Suka” itu kata paling hebat!`);
                    this._sendMessage(this.messages, `“Suka” itu kata paling hebat!`);
                    this._sendMessage(this.messages, `Ungkapkan perasaanmu`);
                    this._sendMessage(this.messages, `Jujurlah dari sekarang juga..`);
                    }
           return;
    }


    reset() {
        if(this.isAdminOrBot(this.messages.from)){
        this._sendMessage(this.messages, `Data dihapus!`);
        this.checkReader = [];
        }
        return
    }

    list() {
            this._sendMessage(this.messages,`Ketik "Admin" Untuk Melihat Admin Bot!`);
     }

creator() {
        let msg = {
            text:null,
            contentType: 13,
            contentPreview: null,
            contentMetadata: 
            { mid: 'u813e54635fa8ca8c016090e933582652'}
        }
        Object.assign(this.messages,msg);
        this._sendMessage(this.messages);
 }

admin1() {
        let msg = {
            text:null,
            contentType: 13,
            contentPreview: null,
            contentMetadata: 
            { mid: 'u813e54635fa8ca8c016090e933582652'}
        }
        Object.assign(this.messages,msg);
        this._sendMessage(this.messages);
 }



    resetStateUpload() {
        this.stateUpload = {
            file: '',
            name: '',
            group: '',
            sender: ''
        };
    }

    prepareUpload() {
        this.stateUpload = {
            file: true,
            name: this.payload.join(' '),
            group: this.messages.to,
            sender: this.messages.from
        };
        this._sendMessage(this.messages,` ${this.stateUpload.name}`);
        return;
    }
    
    async doUpload({ id, contentType }) {
        let url = `https://obs-sg.line-apps.com/talk/m/download.nhn?oid=${id}`;
        await this._download(url,this.stateUpload.name, contentType);
        this.messages.contentType = 0;
        this._sendMessage(this.messages,` ${this.stateUpload.name} `);
        this.resetStateUpload()
        return;
    }

    searchLocalImage() {
        let name = this.payload.join(' ');
        let dirName = `${__dirname}/../download/${name}.jpg`;
        try {
            this._sendImage(this.messages,dirName);
        } catch (error) {
             this._sendImage(this.messages,`No Photo #${name} Uploaded `);
        }
        return ;
        
    }

    async joinQr() {
        const [ ticketId ] = this.payload[0].split('g/').splice(-1);
        let { id } = await this._findGroupByTicket(ticketId);
        await this._acceptGroupInvitationByTicket(id,ticketId);
        return;
    }

    async qrOpenClose() {
        let updateGroup = await this._getGroup(this.messages.to);
        updateGroup.preventJoinByTicket = true;
        if(typeof this.payload !== 'undefined') {
            let [ type ] = this.payload;p

            if(type === 'open') {
                updateGroup.preventJoinByTicket = false;
                const groupUrl = await this._reissueGroupTicket(this.messages.to)
                this._sendMessage(this.messages,`Line group = line://ti/g/${groupUrl}`);
            }
        }
        await this._updateGroup(updateGroup);
        return;
    }

    spamGroup() {
        if(this.isAdminOrBot(this.messages.from) && this.payload[0] !== 'kill') {
            let s = [];
            for (let i = 0; i < this.payload[1]; i++) {
                let name = `${Math.ceil(Math.random() * 1000)}${i}`;
                this.spamName.push(name);
                this._createGroup(name,[this.payload[0]]);
            }
            return;
        } 
        for (let z = 0; z < this.spamName.length; z++) {
            this.leftGroupByName(this.spamName[z]);
        }
        return true;
    }

    checkIP() {
        exec(`wget ipinfo.io/${this.payload[0]} -qO -`,(err, res) => {
            if(err) {
                this._sendMessage(this.messages,'Error Please Install Wget');
                return 
            }
            const result = JSON.parse(res);
            if(typeof result.error == 'undefined') {
                const { org, country, loc, city, region } = result;
                try {
                    const [latitude, longitude ] = loc.split(',');
                    let location = new Location();
                    Object.assign(location,{ 
                        title: `Location:`,
                        address: `${org} ${city} [ ${region} ]\n${this.payload[0]}`,
                        latitude: latitude,
                        longitude: longitude,
                        phone: null 
                    })
                    const Obj = { 
                        text: 'Location',
                        location : location,
                        contentType: 0,
                    }
                    Object.assign(this.messages,Obj)
                    this._sendMessage(this.messages,'Location');
                } catch (err) {
                    this._sendMessage(this.messages,'Not Found');
                }
            } else {
                this._sendMessage(this.messages,'Location Not Found , Maybe di dalem goa');
            }
        })
        return;
    }

    async rechecks() {
        if(this.isAdminOrBot(this.messages.from)){
        this._sendMessage(this.messages,'Ketik "Reset" Untuk Menghapus List Sider');
        let rec = await this.recheck(this.checkReader,this.messages.to);
        const mentions = await this.mention(rec);
        this.messages.contentMetadata = mentions.cmddata;
        await this._sendMessage(this.messages,mentions.names.join(''));
        }
        return;
    }

    async rechecksss() {
        if(this.isAdminOrBot(this.messages.from)){
        this._sendMessage(this.messages,'Ketik "Reset" Untuk Menghapus List Sider');
        let rec = await this.recheck(this.checkReader,this.messages.to);
        const mentions = await this.mention(rec);
        this.messages.contentMetadata = mentions.cmddata;
        await this._sendMessage(this.messages,mentions.names.join(''));
        }
        return;
}

    async recheckssss() {
        if(this.isAdminOrBot(this.messages.from)){
        this._sendMessage(this.messages,'Ketik "Reset" Untuk Menghapus List Sider');
        let rec = await this.recheck(this.checkReader,this.messages.to);
        const mentions = await this.mention(rec);
        this.messages.contentMetadata = mentions.cmddata;
        await this._sendMessage(this.messages,mentions.names.join(''));
        }
        return;
    }


    async kickAll() {
        let groupID;
        if(this.stateStatus.kick == 1 && this.isAdminOrBot(this.messages.from)) {
            let target = this.messages.to;
            if(this.payload.length > 0) {
                let [ groups ] = await this._findGroupByName(this.payload.join(' '));
                groupID = groups.id;
            }
            let { listMember } = await this.searchGroup(groupID || target);
            for (var i = 0; i < listMember.length; i++) {
                if(!this.isAdminOrBot(listMember[i].mid)){
                    this._kickMember(groupID || target,[listMember[i].mid])
                }
            }
            return;
        } 
        return this._sendMessage(this.messages, 'Relax Sir!');
    }

    help() {
           this._sendMessage(this.messages, `           -㉿- Keyword Khusus Admin -㉿-
•[Kick On/Off] = On/Off Mode Kick
•[Serang] = Mengekick Semua Member
•[Cancel On/Off] = On/Off Mode Cancel
•[Dobol] = Membatalkan Semua Invite'an
•[Qrp On/Off]= On/Off Link Group
           -㉿- Keyword Dalam Group -㉿-
•[Status] = Menampilkan Info Kick&Cancel
•[Speed] = Ngetest Respons Bot
•[Left NamaGroup] = Bot Keluar Dari Group
•[Set] = Untuk Memulai Sider
•[Recheck] = Melihat List Yang Sider
•[Reset] = Untuk Hapus List Sider
•[Myid] = Untuk Mengetahui MID
•[Ig Username] = Info Instagram
•[Qr Open/Close] = Buka/Tutup Link Group
•[Spam] = Bot Akan Spam
•[Spam group] = Bot Akan Spam Di Group
•[List admin] = Melihat Daftar Admin
•[Desah] = Mengetag Semua Member
•[Creator] = Owner Pembuat Bot
•[Admin] = Admin Bot
•[Play JudulLagu] = Bot Akan Mengirim Lagu
•[Vn Kalimat] = Bot Akan Mengirim Vn
•[Gift] = Send Sticker`);

     {             this._sendMessage(this.messages, `Author & Administrator : [BLVCK DRAGON]™`);
     }
     }


    listlagu1() {
                    this._sendMessage(this.messages, `           -㉿- List Lagu 1 -㉿-
•[Lagu baby shark] = Sing And Dance
•[Lagu ML] = Mobile Legend
•[Lagu despacito] = Luis Fonsi
•[Lagu faded] = Arlan Walker
•[Lagu dear god] = Avenged Sevenfold
•[Lagu jadi aku sebentar saja] = Judika
•[Lagu mendua] = Astrid
•[Lagu tentang rasa] = Astrid
•[Lagu sayang] = Via Vallen
•[Lagu jaran goyang] = Nella Kharisma
•[Lagu goyang dumang] = Cita-Citata`);
      }

    listlagu2() {
                    this._sendMessage(this.messages, `           -㉿- List Lagu 2 -㉿-
•[Lagu asal kau bahagia] = Armada
•[Lagu canon rock] = Gitar
•[Lagu closer] = The Chainsmoker
•[Lagu dusk till dawn] = Zyan
•[Lagu rockabye] = Clean Bandit
•[Lagu shape of you] = Ed Sheeran
•[Lagu perfect] = Ed Sheeran
•[Lagu hilang] = Killing Me Inside
•[Lagu salah] = Lobow`);
      }


    async checkIG() {
        try {
            let { userProfile, userName, bio, media, follow } = await this._searchInstagram(this.payload[0]);
            await this._sendFileByUrl(this.messages,userProfile);
            await this._sendMessage(this.messages, `${userName}\n\nBIO:\n${bio}\n\n\uDBC0 ${follow} \uDBC0`)
            if(Array.isArray(media)) {
                for (let i = 0; i < media.length; i++) {
                    await this._sendFileByUrl(this.messages,media[i]);
                }
            } else {
                this._sendMessage(this.messages,media);
            }
        } catch (error) {
            this._sendMessage(this.messages,`Error: ${error}`);
        }
        return;
    }
}

module.exports = Command;
