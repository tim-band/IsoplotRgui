function stringify(v) {
    if (typeof(v) === 'string') {
        return '"' + v + '"';
    } else if (v === null) {
        return "NULL";
    } else if (typeof(v) === 'object') {
        if ('toR' in v) {
            return v.toR();
        }
        var out = 'c(';
        var sep = '';
        for (var i in v) {
            out += sep + stringify(v[i]);
            sep = ',';
        }
        return out + ')';
    } else if (typeof(v) === 'boolean') {
        return v? 'TRUE' : 'FALSE';
    } else {
        return String(v);
    }
}

function makeSettings() {
    var out = "";
    return {
        result: function() { return out; },
        add: function(kvs) {
            for (var k in kvs) {
                out += "," + k + "=" + stringify(kvs[k]);
            }
        },
        addRaw: function(kvs) {
            for (var k in kvs) {
                out += "," + k + "=" + kvs[k];
            }
        },
        addIfNot(forbiddenValue, kvs) {
            for (var k in kvs) {
                const v = kvs[k];
                if (v !== forbiddenValue) {
                    out += "," + k + "=" + stringify(v);
                }
            }
        }
    }
}

// turns the options into a string to feed into R
function getOptions(prefs){
    const NA = {
        toR: function() { return 'NA'; }
    };
    var out = makeSettings();
    var geochronometer = prefs.settings.geochronometer;
    var plotdevice = prefs.settings.plotdevice;
    var pdsettings = prefs.settings[plotdevice];
    var gcsettings = prefs.settings[geochronometer];
    switch (plotdevice){
    case 'concordia':
        var mint = check(pdsettings.mint,null);
        var maxt = check(pdsettings.maxt,null);
        if (mint != null | maxt != null){
            out.add({
                tlim: [
                    mint === null? 0 : mint,
                    maxt === null? 4500 : maxt
                ]
            });
        } else {
            out.add({tlim: null});
        }
        if (pdsettings.minx != 'auto' & pdsettings.maxx != 'auto'){
            out.add({xlim: [pdsettings.minx, pdsettings.maxx]});
        }
        if (pdsettings.miny != 'auto' & pdsettings.maxy != 'auto'){
            out.add({ylim: [pdsettings.miny, pdsettings.maxy]});
        }
        if (pdsettings.ticks != 'auto'){
            out.add({ticks: [pdsettings.ticks]});
        }
        out.add({
            alpha: pdsettings.alpha,
            type: pdsettings.type,
            exterr: pdsettings.exterr,
            'show.numbers': pdsettings.shownumbers,
            'show.age': pdsettings.showage,
            sigdig: pdsettings.sigdig,
            'common.Pb': gcsettings.commonPb,
            clabel: pdsettings.clabel,
        });
        out.addRaw({
            'ellipse.fill': pdsettings.ellipsefill,
            'ellipse.stroke': pdsettings.ellipsestroke,
            levels: "selection2levels()",
            omit: "omitter(flags='x')",
            hide: "omitter(flags='X')"
        });
        if (pdsettings.anchor==1){
            out.add({ anchor: 1 });
        } else if (pdsettings.anchor==2){
            out.add({ anchor: [2, pdsettings.tanchor] });
        }
        break;
    case 'radial':
        out.add({ transformation: pdsettings.transformation });
        out.addRaw({
            levels: "selection2levels()",
            omit: "omitter(flags='x')",
            hide: "omitter(flags='X')",
        });
        if (pdsettings.numpeaks == 'auto'){ out.add({ k: "auto" }); }
        else if (pdsettings.numpeaks == 'min'){ out.add({ k: "min'" }); }
        else { out.add({ k: pdsettings.numpeaks }); }
        out.addIfNot('auto', {
            from: pdsettings.mint,
            z0: pdsettings.z0,
            to: pdsettings.maxt
        });
        out.add({
            pch: pdsettings.pch,
            cex: pdsettings.cex,
            alpha: pdsettings.alpha,
            sigdig: pdsettings.sigdig,
            'show.numbers': pdsettings.shownumbers,
            clabel: pdsettings.clabel
        });
        out.addRaw({
            bg: pdsettings.bg,
        });
        if (geochronometer != "other" &&
            geochronometer != "Th-U" &&
            geochronometer != 'U-Th-He'){
            out.add({ exterr: pdsettings.exterr });
        }
        switch (geochronometer){
        case 'Th-U':
            out.add({ detritus: gcsettings.detritus });
        case 'Ar-Ar':
        case 'Th-Pb':
        case 'K-Ca':
        case 'Rb-Sr':
        case 'Sm-Nd':
        case 'Re-Os':
        case 'Lu-Hf':
            out.add({ "i2i": gcsettings.i2i });
            break;
        case 'U-Pb':
            var type = gcsettings.type;
            out.add({ type: type });
            if (type==4){
                out.add({ "cutoff.76": gcsettings.cutoff76 });
            }
            if (gcsettings.cutoffdisc!=0){
                var opt = gcsettings.discoption;
                out.addRaw({
                    "cutoff.disc": "IsoplotR::discfilter(" +
                        "option=" + opt + "," +
                        "cutoff=c(" + gcsettings.mindisc[opt-1] +
                        "," + gcsettings.maxdisc[opt-1] + "),",
                });
                out.add({ before: gcsettings.cutoffdisc==1 });
            }
        case 'Pb-Pb':
            out.add({ "common.Pb": gcsettings.commonPb });
        default:
        }
        break;
    case 'evolution':
        var transform = (pdsettings.transform=='TRUE');
        if (transform & pdsettings.mint != 'auto' & pdsettings.maxt != 'auto'){
            out.add({ xlim: [pdsettings.mint, pdsettings.maxt] });
        }
        if (!transform & pdsettings.min08 != 'auto' & pdsettings.max08 != 'auto'){
            out.add({ xlim: [pdsettings.min08, pdsettings.max08] });
        }
        if (pdsettings.min48 != 'auto' & pdsettings.max48 != 'auto'){
            out.add({ ylim: [pdsettings.min48, pdsettings.max48] });
        }
        out.add({
            alpha: pdsettings.alpha,
            "show.numbers": pdsettings.shownumbers,
            sigdig: pdsettings.sigdig,
            transform: pdsettings.transform,
            detritus: gcsettings.detritus,
            exterr: pdsettings.exterr,
            isochron: pdsettings.isochron,
            model: pdsettings.model,
            clabel: pdsettings.clabel
        });
        out.addRaw({
            levels: "selection2levels()",
            omit: "omitter(flags='x')",
            hide: "omitter(flags='X')",
            "ellipse.fill": pdsettings.ellipsefill,
            "ellipse.stroke": pdsettings.ellipsestroke,
        });
        break;
    case 'isochron':
        if (geochronometer!='U-Pb' & geochronometer!='Th-U' &
            geochronometer!='U-Th-He'){ out.add({ inverse: gcsettings.inverse }); }
        if (geochronometer=='Pb-Pb'){ out.add({ growth: pdsettings.growth }); }
        if (geochronometer=='U-Pb'){
            out.add({ type: pdsettings.UPbtype });
            if (gcsettings.format>3){
                out.add({ joint: pdsettings.joint });
            }
            if (pdsettings.anchor==1){
                out.add({ anchor: 1 });
            } else if (pdsettings.anchor==2){
                out.add({ anchor: [2, pdsettings.tanchor] });
            }
        }
        if (geochronometer=='Th-U'){ out.add({ type: pdsettings.ThUtype }); }
        if (geochronometer!='U-Th-He'){ out.add({ exterr: pdsettings.exterr }); }
    case 'regression':
        if (pdsettings.minx != 'auto' & pdsettings.maxx != 'auto'){
            out.add({ xlim: [pdsettings.minx, pdsettings.maxx] });
        }
        if (pdsettings.miny != 'auto' & pdsettings.maxy != 'auto'){
            out.add({ ylim: [pdsettings.miny, pdsettings.maxy] });
        }
        out.add({
            alpha: pdsettings.alpha,
            "show.numbers": pdsettings.shownumbers,
            sigdig: pdsettings.sigdig,
            model: pdsettings.model,
            clabel: pdsettings.clabel,
        });
        out.addRaw({
            "ellipse.fill": pdsettings.ellipsefill,
            "ellipse.stroke": pdsettings.ellipsestroke,
            levels: "selection2levels()",
            omit: "omitter(flags='x')",
            hide: "omitter(flags='X')"
        });
        break;
    case 'average':
        switch (geochronometer){
        case 'Th-U':
            out.add({ detritus: gcsettings.detritus });
        case 'Ar-Ar':
        case 'Th-Pb':
        case 'K-Ca':
        case 'Rb-Sr':
        case 'Sm-Nd':
        case 'Re-Os':
        case 'Lu-Hf':
            out.add({ "i2i": gcsettings.i2i });
            break;
        case 'U-Pb':
            var type = gcsettings.type;
            out.add({ type: type });
            if (type==4){
                out.add({ "cutoff.76": gcsettings.cutoff76 });
            }
            if (gcsettings.cutoffdisc!=0){
                var opt = gcsettings.discoption;
                out.addRaw({ "cutoff.disc": "IsoplotR::discfilter(" +
                    "option=" + opt + "," +
                    "cutoff=c(" + gcsettings.mindisc[opt-1] +
                    "," + gcsettings.maxdisc[opt-1] + "),"
                });
                out.add({ before: gcsettings.cutoffdisc==1 });
            }
        case 'Pb-Pb':
            out.add({ "common.Pb": gcsettings.commonPb });
            break;
        }
        if (geochronometer != "other" &
            geochronometer != "Th-U" &
            geochronometer != 'U-Th-He'){
            out.add({ exterr: pdsettings.exterr });
        }
    out.add({
            "detect.outliers": pdsettings.outliers,
            alpha: pdsettings.alpha,
            sigdig: pdsettings.sigdig,
            "random.effects": pdsettings.randomeffects,
            ranked: pdsettings.ranked,
            clabel: pdsettings.clabel
    });
    if (pdsettings.mint != 'auto'){ out.add({ "from": pdsettings.mint }); }
    if (pdsettings.maxt != 'auto'){ out.add({ "to": pdsettings.maxt }); }
        out.addRaw({
            "rect.col": pdsettings.rectcol,
            "outlier.col": pdsettings.outliercol,
            levels: "selection2levels()",
            omit: "omitter(flags='x')",
            hide: "omitter(flags='X')"
        });
        break;
    case 'spectrum':
        if (geochronometer=='Ar-Ar'){
            out.add({
                i2i: gcsettings.i2i,
                exterr: pdsettings.exterr
            });
        }
        out.add({
            plateau: pdsettings.plateau,
            "random.effects": pdsettings.randomeffects,
            alpha: pdsettings.alpha,
            sigdig: pdsettings.sigdig,
            clabel: pdsettings.clabel
        });
        out.addRaw({
            "plateau.col": pdsettings.plateaucol,
            "non.plateau.col": pdsettings.nonplateaucol,
            levels: "selection2levels()",
            omit: "omitter(flags='x')",
            hide: "omitter(flags='X')"
        });
        break;
    case 'KDE':
        out.add({
            "from": pdsettings.minx === 'auto'? NA : pdsettings.minx,
            "to": pdsettings.maxx === 'auto'? NA : pdsettings.maxx,
            "bw": pdsettings.bandwidth === 'auto'? NA : pdsettings.bandwidth,
            "show.hist": pdsettings.showhist,
            adaptive: pdsettings.adaptive
        });
        switch (geochronometer){
        case 'Th-U':
            out.add({ detritus: gcsettings.detritus });
        case 'Ar-Ar':
        case 'Th-Pb':
        case 'K-Ca':
        case 'Rb-Sr':
        case 'Sm-Nd':
        case 'Re-Os':
        case 'Lu-Hf':
            out.add({ i2i: gcsettings.i2i });
            break;
        case 'U-Pb':
            var type = gcsettings.type;
            out.add({ type: type });
            if (type==4){
                out.add({ "cutoff.76": gcsettings.cutoff76 });
            }
            if (gcsettings.cutoffdisc!=0){
                var opt = gcsettings.discoption;
                out.addRaw({ "cutoff.disc": "IsoplotR::discfilter(" +
                    "option=" + opt + "," +
                    "cutoff=c(" + gcsettings.mindisc[opt-1] +
                    "," + gcsettings.maxdisc[opt-1] + "),"
        });
        out.add({ before: gcsettings.cutoffdisc==1 });
            }
        case 'Pb-Pb':
            out.add({ "common.Pb": gcsettings.commonPb });
            break;
        case 'detritals':
            out.add({
                samebandwidth: pdsettings.samebandwidth,
                normalise: pdsettings.normalise
            });
            break;
        default:
        }
        out.add({
            rug: geochronometer=="detritals"? pdsettings.rugdetritals : pdsettings.rug,
            log: pdsettings.log
        });
        out.add({ binwidth: pdsettings.binwidth === 'auto'? NA : pdsettings.binwidth });
        if (geochronometer=='detritals'){
            out.add({ hide: gcsettings.hide });
        } else {
            out.addRaw({ hide: "omitter(flags=c('x','X'))" });
        }
        break;
    case 'CAD':
        if (pdsettings.pch!='none'){ out.add({ pch: pdsettings.pch }); }
        out.add({ verticals: pdsettings.verticals });
        switch (geochronometer){
        case 'Th-U':
            out.add({ detritus: gcsettings.detritus });
        case 'Ar-Ar':
        case 'Th-Pb':
        case 'K-Ca':
        case 'Rb-Sr':
        case 'Sm-Nd':
        case 'Re-Os':
        case 'Lu-Hf':
            out.add({ i2i: gcsettings.i2i });
            break;
        case 'U-Pb':
            var type = gcsettings.type;
            out.add({ type: type });
            if (type==4){
                out.add({ "cutoff.76": gcsettings.cutoff76 });
            }
            if (gcsettings.cutoffdisc!=0){
                var opt = gcsettings.discoption;
                out.addRaw({ "cutoff.disc": "IsoplotR::discfilter(" +
                    "option=" + opt + "," +
                    "cutoff=c(" + gcsettings.mindisc[opt-1] +
                    "," + gcsettings.maxdisc[opt-1] + "),"
        });
        out.add({before: gcsettings.cutoffdisc==1 });
            }
        case 'Pb-Pb':
            out.add({ "common.Pb": gcsettings.commonPb });
            break;
        default:
        }
        if (geochronometer=='detritals'){
            out.add({
            col: pdsettings.colmap,
                hide: gcsettings.hide
        });
        } else {
            out.addRaw({ hide: "omitter(flags=c('x','X'))" });
        }
        break;
    case 'set-zeta':
        var data = prefs.data.fissiontracks;
        out.add({
            tst: [ data.age[0], data.age[1] ],
            exterr: pdsettings.exterr,
            sigdig: pdsettings.sigdig,
            update: false
        });
        break;
    case 'helioplot':
        out.add({
            logratio: pdsettings.logratio,
            "show.numbers": pdsettings.shownumbers,
            "show.central.comp": pdsettings.showcentralcomp,
            alpha: pdsettings.alpha,
            sigdig: pdsettings.sigdig,
        });
        if (pdsettings.minx != 'auto' & pdsettings.maxx != 'auto'){
            out.add({ xlim: [ pdsettings.minx, pdsettings.maxx ] });
        }
        if (pdsettings.miny != 'auto' & pdsettings.maxy != 'auto'){
            out.add({ ylim: [ pdsettings.miny, pdsettings.maxy ] });
        }
        if (pdsettings.fact != 'auto'){
            out.add({ fact: pdsettings.fact });
        }
        out.addRaw({
            "levels": "selection2levels()",
            "omit": "omitter(flags='x')",
            "hide": "omitter(flags='X')",
            "ellipse.fill": pdsettings.ellipsefill,
            "ellipse.stroke": pdsettings.ellipsestroke,
        });
        out.add({
                model: pdsettings.model,
                clabel: pdsettings.clabel
        });
        break;
    case 'MDS':
        out.add({
            classical: pdsettings.classical,
            shepard: pdsettings.shepard,
            nnlines: pdsettings.nnlines,
            pch: pdsettings.pch === 'none'? NA : pdsettings.pch
        });
        if (pdsettings.shepard=='FALSE'){ out.add({ cex: pdsettings.cex }); }
        if (pdsettings.pos==1 | pdsettings.pos==2 |
            pdsettings.pos==3 | pdsettings.pos==4){
            out.add({ pos: pdsettings.pos });
        }
        out.add({
            hide: gcsettings.hide,
            col: pdsettings.col,
            bg: pdsettings.bg,
        });
        break;
    case 'ages':
        if (geochronometer == 'U-Pb' & pdsettings.showdisc!=0){
            out.addRaw({
                discordance: "IsoplotR::discfilter(option=" +
                pdsettings.discoption + ",before=" +
                pdsettings.showdisc === 1? "TRUE)" : "FALSE)"
            });
        }
        if (geochronometer != 'U-Th-He'){
            out.add({ exterr: pdsettings.exterr });
        }
        switch (geochronometer){
        case 'Th-U':
            out.add({
                i2i: gcsettings.i2i,
                isochron: false,
                detritus: gcsettings.detritus
            });
            break;
        case 'Th-Pb':
        case 'K-Ca':
        case 'Rb-Sr':
        case 'Sm-Nd':
        case 'Re-Os':
        case 'Lu-Hf':
        case 'Ar-Ar':
        out.add({
            i2i: gcsettings.i2i,
            isochron: false,
            projerr: gcsettings.projerr
        });
            break;
        case 'Pb-Pb':
        out.add({
            isochron: false,
            projerr: gcsettings.projerr
        });
        case 'U-Pb':
            out.add({ "common.Pb": gcsettings.commonPb });
            break;
        default:
        }
        out.add({ sigdig: pdsettings.sigdig });
        break;
    default: // do nothing
    }
    return out.result();
}

function concatenate(vector){
    var out = "c(" + vector[0];
    for (i=1; i<vector.length; i++){
	out += "," + vector[i];
    }
    out += ")";
    return out;
}

function getRcommand(prefs){
    var geochronometer = prefs.settings.geochronometer;
    var plotdevice = prefs.settings.plotdevice;
    var options = getOptions(prefs);
    console.log(options);
    var gcsettings = prefs.settings[geochronometer];
    var out = "dat <- selection2data(input, method='" + geochronometer + "'";
    if (geochronometer=='detritals' |
	geochronometer=='fissiontracks' |
	geochronometer=='U-Pb'  |
	geochronometer=='Pb-Pb' |
	geochronometer=='Ar-Ar' |
	geochronometer=='Th-Pb' |
	geochronometer=='K-Ca' |
	geochronometer=='Th-U'  |
	geochronometer=='Rb-Sr' |
        geochronometer=='Sm-Nd' |
        geochronometer=='Re-Os' |
        geochronometer=='Lu-Hf'){
	out += ",format=" + gcsettings.format;
    } else if (geochronometer=='other'){
	out += ",format='" + plotdevice + "'";
    }
    if (geochronometer=='U-Pb' & gcsettings.diseq=='TRUE'){
	out += ",d=IsoplotR::diseq(";
	out += "U48=list(x=" + gcsettings.U48[0] +
	       ",option=" + gcsettings.U48[1] + ")";
	out += ",ThU=list(x=" + gcsettings.ThU[0] +
	       ",option=" + gcsettings.ThU[1] + ")";
	out += ",RaU=list(x=" + gcsettings.RaU[0] +
	       ",option=" + gcsettings.RaU[1] + ")";
	out += ",PaU=list(x=" + gcsettings.PaU[0] +
	       ",option=" + gcsettings.PaU[1] + ")";
	out += ")";
    } else if (geochronometer=='Th-U'){
	out += ",Th02=" + concatenate(gcsettings.Th02);
	out += ",Th02U48=" + concatenate(gcsettings.Th02U48);
    }
    out += ",ierr=" + prefs.settings.ierr;
    out += ");";
    switch (geochronometer){
    case 'U-Pb':
	out += "IsoplotR::settings('iratio','Pb207Pb206'," +
	    prefs.constants.iratio.Pb207Pb206[0] + ");"
	out += "IsoplotR::settings('iratio','Pb208Pb206'," +
	    prefs.constants.iratio.Pb208Pb206[0] + ");"
	out += "IsoplotR::settings('iratio','Pb208Pb207'," +
	    prefs.constants.iratio.Pb208Pb207[0] + ");"
	out += "IsoplotR::settings('lambda','Th232'," +
	    prefs.constants.lambda.Th232[0] + "," +
	    prefs.constants.lambda.Th232[1] + ");"
	out += "IsoplotR::settings('lambda','U234'," +
	    prefs.constants.lambda.U234[0] + "," +
	    prefs.constants.lambda.U234[1] + ");"
	out += "IsoplotR::settings('lambda','Th230'," +
	    prefs.constants.lambda.Th230[0] + "," +
	    prefs.constants.lambda.Th230[1] + ");"
	out += "IsoplotR::settings('lambda','Ra226'," +
	    prefs.constants.lambda.Ra226[0] + "," +
	    prefs.constants.lambda.Ra226[1] + ");"
	out += "IsoplotR::settings('lambda','Pa231'," +
	    prefs.constants.lambda.Pa231[0] + "," +
	    prefs.constants.lambda.Pa231[1] + ");"
    case 'Pb-Pb':
	out += "IsoplotR::settings('iratio','Pb206Pb204'," +
	    prefs.constants.iratio.Pb206Pb204[0] + "," +
	    prefs.constants.iratio.Pb206Pb204[1] + ");"
	out += "IsoplotR::settings('iratio','Pb207Pb204'," +
	    prefs.constants.iratio.Pb207Pb204[0] + "," +
	    prefs.constants.iratio.Pb207Pb204[1] + ");"
	out += "IsoplotR::settings('iratio','U238U235'," +
	    prefs.constants.iratio.U238U235[0] + "," +
	    prefs.constants.iratio.U238U235[1] + ");"
	out += "IsoplotR::settings('lambda','U238'," +
	    prefs.constants.lambda.U238[0] + "," +
	    prefs.constants.lambda.U238[1] + ");"
	out += "IsoplotR::settings('lambda','U235'," +
	    prefs.constants.lambda.U235[0] + "," +
	    prefs.constants.lambda.U235[1] + ");"
	break;
    case 'Th-U':
	out += "IsoplotR::settings('lambda','Th230'," +
	    prefs.constants.lambda.Th230[0] + "," +
	    prefs.constants.lambda.Th230[1] + ");"
	out += "IsoplotR::settings('lambda','U234'," +
	    prefs.constants.lambda.U234[0] + "," +
	    prefs.constants.lambda.U234[1] + ");"
	break;
    case 'Ar-Ar':
	out += "IsoplotR::settings('iratio','Ar40Ar36'," +
	    prefs.constants.iratio.Ar40Ar36[0] + "," +
	    prefs.constants.iratio.Ar40Ar36[1] + ");"
	out += "IsoplotR::settings('lambda','K40'," +
	    prefs.constants.lambda.K40[0] + "," +
	    prefs.constants.lambda.K40[1] + ");"
	break;
    case 'Th-Pb':
	out += "IsoplotR::settings('iratio','Pb208Pb204'," +
	    prefs.constants.iratio.Pb208Pb204[0] + "," +
	    prefs.constants.iratio.Pb208Pb204[1] + ");"
	out += "IsoplotR::settings('lambda','Th232'," +
	    prefs.constants.lambda.Th232[0] + "," +
	    prefs.constants.lambda.Th232[1] + ");"
	break;
    case 'K-Ca':
	out += "IsoplotR::settings('iratio','Ca40Ca44'," +
	    prefs.constants.iratio.Ca40Ca44[0] + "," +
	    prefs.constants.iratio.Ca40Ca44[1] + ");"
	out += "IsoplotR::settings('lambda','K40'," +
	    prefs.constants.lambda.K40[0] + "," +
	    prefs.constants.lambda.K40[1] + ");"
	break;
    case 'Sm-Nd':
	out += "IsoplotR::settings('iratio','Sm144Sm152'," +
	    prefs.constants.iratio.Sm144Sm152[0] + "," +
	    prefs.constants.iratio.Sm144Sm152[1] + ");"
	out += "IsoplotR::settings('iratio','Sm147Sm152'," +
	    prefs.constants.iratio.Sm147Sm152[0] + "," +
	    prefs.constants.iratio.Sm147Sm152[1] + ");"
	out += "IsoplotR::settings('iratio','Sm148Sm152'," +
	    prefs.constants.iratio.Sm148Sm152[0] + "," +
	    prefs.constants.iratio.Sm148Sm152[1] + ");"
	out += "IsoplotR::settings('iratio','Sm149Sm152'," +
	    prefs.constants.iratio.Sm149Sm152[0] + "," +
	    prefs.constants.iratio.Sm149Sm152[1] + ");"
	out += "IsoplotR::settings('iratio','Sm150Sm152'," +
	    prefs.constants.iratio.Sm150Sm152[0] + "," +
	    prefs.constants.iratio.Sm150Sm152[1] + ");"
	out += "IsoplotR::settings('iratio','Sm154Sm152'," +
	    prefs.constants.iratio.Sm154Sm152[0] + "," +
	    prefs.constants.iratio.Sm154Sm152[1] + ");"
	out += "IsoplotR::settings('iratio','Nd142Nd144'," +
	    prefs.constants.iratio.Nd142Nd144[0] + "," +
	    prefs.constants.iratio.Nd142Nd144[1] + ");"
	out += "IsoplotR::settings('iratio','Nd143Nd144'," +
	    prefs.constants.iratio.Nd143Nd144[0] + "," +
	    prefs.constants.iratio.Nd143Nd144[1] + ");"
	out += "IsoplotR::settings('iratio','Nd145Nd144'," +
	    prefs.constants.iratio.Nd145Nd144[0] + "," +
	    prefs.constants.iratio.Nd145Nd144[1] + ");"
	out += "IsoplotR::settings('iratio','Nd146Nd144'," +
	    prefs.constants.iratio.Nd146Nd144[0] + "," +
	    prefs.constants.iratio.Nd146Nd144[1] + ");"
	out += "IsoplotR::settings('iratio','Nd148Nd144'," +
	    prefs.constants.iratio.Nd148Nd144[0] + "," +
	    prefs.constants.iratio.Nd148Nd144[1] + ");"
	out += "IsoplotR::settings('iratio','Nd150Nd144'," +
	    prefs.constants.iratio.Nd150Nd144[0] + "," +
	    prefs.constants.iratio.Nd150Nd144[1] + ");"
	out += "IsoplotR::settings('lambda','Sm147'," +
	    prefs.constants.lambda.Sm147[0] + "," +
	    prefs.constants.lambda.Sm147[1] + ");"	
	break;
    case 'Re-Os':
	out += "IsoplotR::settings('iratio','Os184Os192'," +
	    prefs.constants.iratio.Os184Os192[0] + "," +
	    prefs.constants.iratio.Os184Os192[1] + ");"
	out += "IsoplotR::settings('iratio','Os186Os192'," +
	    prefs.constants.iratio.Os186Os192[0] + "," +
	    prefs.constants.iratio.Os186Os192[1] + ");"
	out += "IsoplotR::settings('iratio','Os187Os192'," +
	    prefs.constants.iratio.Os187Os192[0] + "," +
	    prefs.constants.iratio.Os187Os192[1] + ");"
	out += "IsoplotR::settings('iratio','Os188Os192'," +
	    prefs.constants.iratio.Os188Os192[0] + "," +
	    prefs.constants.iratio.Os188Os192[1] + ");"
	out += "IsoplotR::settings('iratio','Os190Os192'," +
	    prefs.constants.iratio.Os190Os192[0] + "," +
	    prefs.constants.iratio.Os190Os192[1] + ");"
	out += "IsoplotR::settings('lambda','Re187'," +
	    prefs.constants.lambda.Re187[0] + "," +
	    prefs.constants.lambda.Re187[1] + ");"	
	break;
    case 'Rb-Sr':
	out += "IsoplotR::settings('iratio','Rb85Rb87'," +
	    prefs.constants.iratio.Rb85Rb87[0] + "," +
	    prefs.constants.iratio.Rb85Rb87[1] + ");"
	out += "IsoplotR::settings('iratio','Sr84Sr86'," +
	    prefs.constants.iratio.Sr84Sr86[0] + "," +
	    prefs.constants.iratio.Sr84Sr86[1] + ");"
	out += "IsoplotR::settings('iratio','Sr87Sr86'," +
	    prefs.constants.iratio.Sr87Sr86[0] + "," +
	    prefs.constants.iratio.Sr87Sr86[1] + ");"
	out += "IsoplotR::settings('iratio','Sr88Sr86'," +
	    prefs.constants.iratio.Sr88Sr86[0] + "," +
	    prefs.constants.iratio.Sr88Sr86[1] + ");"
	out += "IsoplotR::settings('lambda','Rb87'," +
	    prefs.constants.lambda.Rb87[0] + "," +
	    prefs.constants.lambda.Rb87[1] + ");"
	break;
    case 'Lu-Hf':
	out += "IsoplotR::settings('iratio','Lu176Lu175'," +
	    prefs.constants.iratio.Lu176Lu175[0] + "," +
	    prefs.constants.iratio.Lu176Lu175[1] + ");"
	out += "IsoplotR::settings('iratio','Hf174Hf177'," +
	    prefs.constants.iratio.Hf174Hf177[0] + "," +
	    prefs.constants.iratio.Hf174Hf177[1] + ");"
	out += "IsoplotR::settings('iratio','Hf176Hf177'," +
	    prefs.constants.iratio.Hf176Hf177[0] + "," +
	    prefs.constants.iratio.Hf176Hf177[1] + ");"
	out += "IsoplotR::settings('iratio','Hf178Hf177'," +
	    prefs.constants.iratio.Hf178Hf177[0] + "," +
	    prefs.constants.iratio.Hf178Hf177[1] + ");"
	out += "IsoplotR::settings('iratio','Hf179Hf177'," +
	    prefs.constants.iratio.Hf179Hf177[0] + "," +
	    prefs.constants.iratio.Hf179Hf177[1] + ");"
	out += "IsoplotR::settings('iratio','Hf180Hf177'," +
	    prefs.constants.iratio.Hf180Hf177[0] + "," +
	    prefs.constants.iratio.Hf180Hf177[1] + ");"
	out += "IsoplotR::settings('lambda','Lu176'," +
	    prefs.constants.lambda.Lu176[0] + "," +
	    prefs.constants.lambda.Lu176[1] + ");"
	break;
    case 'U-Th-He': 
	out += "IsoplotR::settings('iratio','U238U235'," +
	    prefs.constants.iratio.U238U235[0] + "," +
	    prefs.constants.iratio.U238U235[1] + ");"
	out += "IsoplotR::settings('lambda','U238'," +
	    prefs.constants.lambda.U238[0] + "," +
	    prefs.constants.lambda.U238[1] + ");"
	out += "IsoplotR::settings('lambda','U235'," +
	    prefs.constants.lambda.U235[0] + "," +
	    prefs.constants.lambda.U235[1] + ");"
	out += "IsoplotR::settings('lambda','Th232'," +
	    prefs.constants.lambda.Th232[0] + "," +
	    prefs.constants.lambda.Th232[1] + ");"
	out += "IsoplotR::settings('lambda','Sm147'," +
	    prefs.constants.lambda.Sm147[0] + "," +
	    prefs.constants.lambda.Sm147[1] + ");"
	break;
    case 'fissiontracks':
	if (prefs.settings.fissiontracks.format == 3){
	    var mineral = prefs.settings.fissiontracks.mineral;
	    out += "IsoplotR::settings('iratio','U238U235'," +
		prefs.constants.iratio.U238U235[0] + "," +
		prefs.constants.iratio.U238U235[1] + ");"
	    out += "IsoplotR::settings('lambda','U238'," +
		prefs.constants.lambda.U238[0] + "," +
		prefs.constants.lambda.U238[1] + ");"
	    out += "IsoplotR::settings('lambda','fission'," +
		prefs.constants.lambda.fission[0] + "," +
		prefs.constants.lambda.fission[1] + ");"
	    out += "IsoplotR::settings('etchfact','" + mineral + "'," +
		prefs.constants.etchfact[mineral] + ");"
	    out += "IsoplotR::settings('tracklength','" + mineral + "'," +
		prefs.constants.tracklength[mineral] + ");"
	    out += "IsoplotR::settings('mindens','" + mineral + "'," +
		prefs.constants.mindens[mineral] + ");"
	}	
	break;
    case 'detritals':
	break;
    }
    if ((plotdevice != 'ages') && (plotdevice != 'set-zeta')){
	out += "par(cex=" + prefs.settings.par.cex + ");";
    }
    switch (plotdevice){
    case 'concordia': 
	out += "IsoplotR::concordia(dat"; 
	break;
    case 'evolution': 
	out += "IsoplotR::evolution(dat"; 
	break;
    case 'regression':
	out += "dat <- IsoplotR::data2york(dat,format=" +
	    prefs.settings['other'].format + ");"
    case 'isochron':
	out += "IsoplotR::isochron(dat";
	break;
    case 'radial':
	out += "IsoplotR::radialplot(dat"
	break;
    case 'spectrum':
	out += "IsoplotR::agespectrum(dat"
	break;
    case 'average':
	out += "IsoplotR::weightedmean(dat"
	break;
    case 'KDE':
	out += "IsoplotR::kde(dat";
	break;
    case 'CAD':
	out += "IsoplotR::cad(dat";
	break;
    case 'set-zeta':
	out += "IsoplotR::set.zeta(dat";
	break;
    case 'helioplot':
	out += "IsoplotR::helioplot(dat";
	break;
    case 'MDS':
	out += "IsoplotR::mds(dat";
	break;
    case 'ages':
	out += "IsoplotR::age(dat";
	break;
    }
    out += options +");"
    return out;
}
