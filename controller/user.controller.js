//Import lowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
var md5 = require('md5');
var randomid = require('randomid')

//End of Import lowDB
//Date time
var d = new Date();


module.exports.index = function (req, res) {
    var find = db.get('Chuyenmuc').value();
    var mathang = db.get('MatHang').value();
    var name;
    var giohang;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;

            giohang = db.get('MatHang').find({ username: name }).value();

        } else {
            name = "";

        }
    }
    else {
        name = "";

    }

    res.render('index', { title: 'Express', find: find, mathang: mathang, name: name, giohang: giohang });
}
module.exports.dangki = function (req, res) {
    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;

            giohang = db.get('MatHang').find({ username: name }).value();

        } else {
            name = "";

        }
    }
    else {
        name = "";

    }
    res.render('dangki', { title: 'Express', status: '', name: name });
}
module.exports.xacthucdangki = function (req, res) {
    var usr = req.body.usr;
    var pass = md5(req.body.pass);
    var giohang = randomid();
    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;

            giohang = db.get('MatHang').find({ username: name }).value();

        } else {
            name = "";

        }
    }
    else {
        name = "";

    }
    var find = db.get('User').find({ username: usr }).value();

    if (find) {
        res.render('dangki', { title: 'Express', status: 'Tai khoan da duoc dang ki' });


    } else {
        db.get('User')
            .push({ username: usr, password: pass, giohang: giohang })
            .write();
        db.get('GioHang')
            .push({ username: usr, idgiohang: giohang, mathang: [] })
            .write();

        res.render('dangnhap', { title: 'Express', status: 'Dang ki thanh cong', name: name });

    }
}
module.exports.dangnhap = function (req, res, next) {
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;

            giohang = db.get('MatHang').find({ username: name }).value();

        } else {
            name = "";

        }
    }
    else {
        name = "";

    }
    res.render('dangnhap', { title: 'Express', status: '', name: name });
}

//Them chuyen muc GET
module.exports.themchuyenmuc = function (req, res, next) {
    var name = req.cookies.info.username;
    res.render('themchuyenmuc', { title: 'Express', status: '', name: name });
}
//Them chuyen muc POST
module.exports.postthemchuyenmuc = function (req, res, next) {
    var ten = req.body.ten;
    var url = req.body.url;
    var id = randomid();

    db.get('Chuyenmuc')
        .push({ ten: ten, id: id, url: url })
        .write()
    var find = db.get('Chuyenmuc').value();

    res.redirect('/');
}
//Them mat hang GET
module.exports.themmathang = function (req, res, next) {
    var name = req.cookies.info.username;

    var chuyenmuc = db.get('Chuyenmuc').value();
    res.render('themmathang', { title: "Them mat hang", chuyenmuc: chuyenmuc, name: name });

    // res.render('themmathang', { title: 'Express', status: '', chuyenmuc:chuyenmuc });
}
//Them mat hang POST
module.exports.postthemmathang = function (req, res, next) {
    var ten = req.body.ten;
    var mota = req.body.mota;
    var gia = req.body.gia;
    var anh = req.body.anh;
    var soluong = req.body.soluong;
    var chuyenmuc = req.body.chuyenmuc;
    var id = randomid();

    db.get('MatHang')
        .push({ ten: ten, id: id, mota: mota, gia: gia, anh: anh, soluong: soluong, chuyenmuc: chuyenmuc })
        .write()
    var find = db.get('Chuyenmuc').value();
    res.redirect('/');

    // res.render('index', { title: 'Express', status: '',find:find  });
}
//Chi tiet mat hang
//Them mat hang POST
module.exports.chitietmathang = function (req, res, next) {
    var name = req.cookies.info.username;

    var id = req.body.id;

    var mathang = db.get('MatHang').find({ id: id }).value();
    var chuyenmuc = db.get('Chuyenmuc').value();

    res.render('chitietmathang', { chuyenmuc: chuyenmuc, mathang: mathang, name: name });

    // res.render('index', { title: 'Express', status: '',find:find  });
}

//Thanh toan
//POST trang thanh toan
module.exports.thanhtoan = function (req, res, next) {
    var name = req.cookies.info.username;

    var id = req.body.id;

    var mathang = db.get('MatHang').find({ id: id }).value();
    var chuyenmuc = db.get('Chuyenmuc').value();

    res.render('thanhtoan', { chuyenmuc: chuyenmuc, mathang: mathang, name: name });

    // res.render('index', { title: 'Express', status: '',find:find  });
}
//Xac nhan thanh toan
//POST trang hoadon
module.exports.hoadon = function (req, res, next) {
    var id = req.body.id;
    var soluongdat = req.body.soluongdat;
    var usr = req.cookies.info.username;
    var mathang = db.get('MatHang').find({ id: id }).value();
    var chuyenmuc = db.get('Chuyenmuc').value();
    var donhang = { id: id, soluongdat: soluongdat, usr: usr, mathang: mathang, }
    console.log(soluongdat);
    
    res.render('hoadon', { chuyenmuc: chuyenmuc, mathang: mathang, donhang: donhang, name: usr ,soluongdat:soluongdat});
}
//POST xac nhan thanh toan
module.exports.xacnhanthanhtoan = function (req, res, next) {
    var id = req.body.id;
    var idhoadon = randomid();
    var magiaodich = randomid();
    var thanhtoan = req.body.thanhtoan;
    var thanhtien = req.body.thanhtien;
    var soluongdat = req.body.soluongdat;
    var usr = req.cookies.info.username;
    var thoigian = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + "-" + d.getHours() + "h" + d.getMinutes() + "p";
    var mathang = db.get('MatHang').find({ id: id }).value();
    var chuyenmuc = db.get('Chuyenmuc').value();

    var donhang = { idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: usr, hang: [{ ten: mathang.ten, gia: mathang.gia, id: id, soluongdat: soluongdat }], thanhtien: thanhtien, idgiohang: 0, thoigian: thoigian };
    db.get('HoaDon')
        .push({ idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: usr, hang: [{ ten: mathang.ten, gia: mathang.gia, id: id, soluongdat: soluongdat }], thanhtien: thanhtien, idgiohang: 0, thoigian: thoigian })
        .write()
    var name = req.cookies.info.username;

    res.render('thongtinhoadon', { chuyenmuc: chuyenmuc, mathang: mathang, donhang: donhang, name: name });
}

//GET Lich su giao dich
module.exports.lichsudathang = function (req, res, next) {

    var usr = req.cookies.info.username;
    var chuyenmuc = db.get('Chuyenmuc').value();
    var hoadon = db.get('HoaDon')
        .value()
    var danhsach = []
    hoadon.forEach(element => {
        if (element.usr == usr) {
            danhsach.push(element);
        }
    });

    res.render('lichsudathang', { hoadon: danhsach, name: usr });
}
//Post Chi tiet lich su don hang
module.exports.chitietlichsudonhang = function (req, res, next) {
    var name = req.cookies.info.username;

    var idhoadon = req.body.idhoadon;

    var donhang = db.get('HoaDon')
        .find({ idhoadon: idhoadon })
        .value();

    res.render('chitietlichsudonhang', { donhang: donhang, name: name });
}
//Logout
module.exports.logout = function (req, res, next) {
    //    res.cookie('info',{'username':usr, 'password':pass});

    res.cookie('info', { expires: Date.now() });
    res.redirect('/');
}
//Them gio hang
module.exports.themgiohang = function (req, res, next) {
    //    res.cookie('info',{'username':usr, 'password':pass});
    var usr = req.cookies.info.username;
    var idhang = req.body.id;
    var hang = db.get('MatHang').find({ id: idhang }).value();
    var giohang = db.get("User").find({ username: usr }).value().giohang;
    var mathang = db.get("GioHang").find({ idgiohang: giohang }).value().mathang;
    // Sửa chỗ số lượng này
    hang["soluongdat"] = 1;
    console.log(hang);

    if (!(mathang.filter(str => str.id == idhang)[0])) {
        mathang.push(hang);
        db.get("GioHang").find({ idgiohang: giohang }).assign({ mathang }).write();
    }
    res.redirect('/');
}
//Xem gio hang
module.exports.giohang = function (req, res, next) {
    var username = req.cookies.info.username;
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ username: username }).value();
    res.render('giohang', { chuyenmuc: chuyenmuc, name: username, giohang: giohang });
}

//Xoa san pham khoi gio
module.exports.xoasanphamkhoigio = function (req, res, next) {
    var username = req.cookies.info.username;
    var idsanpham = req.body.id;
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ username: username }).value();
    var mathang = [];
    giohang.mathang.forEach(element => {
        if (element.id != idsanpham) {
            mathang.push(element);
        }
    });
    db.get("GioHang").find({ username: username }).assign({ mathang }).write();
    giohang = db.get('GioHang').find({ username: username }).value();
    res.render('giohang', { chuyenmuc: chuyenmuc, name: username, giohang: giohang });
}
//AJAX cap nhat gio hang
module.exports.capnhatgiohang = function (req, res, next) {
    var idgiohang = req.body.idgiohang;
    var idmathang = req.body.idmathang;
    var soluongdat = req.body.soluong;
    var giohang = db.get('GioHang').find({ idgiohang: idgiohang }).value();
    
    giohang.mathang.forEach(element => {
        if (element.id == idmathang) {

            element.soluongdat = soluongdat;
        }
    });
    var mathang = giohang.mathang;    
    db.get("GioHang").find({ idgiohang: idgiohang }).assign({ mathang }).write();

    res.send();
}
//Thanh toan gio hang
module.exports.thanhtoangiohang = function (req, res, next) {
    var idgiohang = req.body.idgiohang;
    var username = req.cookies.info.username;
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ idgiohang: idgiohang }).value();
    var tongtien = 0;
    giohang.mathang.forEach(element=>{
        tongtien += element.gia*element.soluongdat;
    })
    res.render('thanhtoangiohang', { chuyenmuc: chuyenmuc, name: username, giohang: giohang, tongtien:tongtien });
}
//Xac nhan thanh toan gio hang
module.exports.xacnhanthanhtoangiohang = function (req, res, next) {    
    var idgiohang = req.body.idgiohang;
    var username = req.cookies.info.username;
    var thanhtoan = req.body.thanhtoan;
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ idgiohang: idgiohang }).value();
    var tongtien = 0;
    giohang.mathang.forEach(element=>{
        tongtien += element.gia*element.soluongdat;
    })

    var idhoadon = randomid();
    var magiaodich = randomid();
   
    var hang = giohang.mathang;
    var thoigian = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + "-" + d.getHours() + "h" + d.getMinutes() + "p";
    console.log("here");

    db.get('HoaDon')
        .push({ idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: username, hang:hang, thanhtien: tongtien, idgiohang: idgiohang, thoigian: thoigian })
        .write()
    var donhang = db.get('HoaDon').find({ idhoadon: idhoadon }).value();
    res.render('thongtinhoadon', { chuyenmuc: chuyenmuc, donhang: donhang, name: username });
}