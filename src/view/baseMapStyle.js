export default {
  data() {
    return {
      wjsStyle: `https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20200716&scale=1&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&styles=t%3Aland%7Ce%3Ag%7Cc%3A%23302920ff%2Ct%3Amanmade%7Ce%3Ag%7Cc%3A%233d372aff%2Ct%3Awater%7Ce%3Ag%7Cc%3A%2343392dff%2Ct%3Aroad%7Ce%3Ag.f%7Cc%3A%239e7d60ff%2Ct%3Aroad%7Ce%3Ag.s%7Cc%3A%23554631ff%2Ct%3Alabel%7Ce%3Al.t.f%7Cc%3A%23d69563ff%2Ct%3Alabel%7Ce%3Al.t.s%7Cc%3A%2317263cff%7Cw%3A3%2Ct%3Apoi%7Ce%3Al.t.f%7Cc%3A%23d69563ff%2Ct%3Apoi%7Ce%3Al.t.s%7Cc%3A%2317263cff%7Cw%3A3%2Ct%3Asubway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Arailway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Apoi%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Asubwaylabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Asubwaylabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Atertiarywaysign%7Ce%3Al%7Cv%3Aoff%2Ct%3Atertiarywaysign%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aprovincialwaysign%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aprovincialwaysign%7Ce%3Al%7Cv%3Aoff%2Ct%3Anationalwaysign%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Anationalwaysign%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighwaysign%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Ahighwaysign%7Ce%3Al%7Cv%3Aoff%2Ct%3Agreen%7Ce%3Ag%7Cc%3A%234f554fff%2Ct%3Anationalwaysign%7Ce%3Al.t.f%7Cc%3A%23d0021bff%2Ct%3Anationalwaysign%7Ce%3Al.t.s%7Cc%3A%23ffffffff%2Ct%3Acity%7Ce%3Al%7Cv%3Aon%2Ct%3Acity%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Acity%7Ce%3Al.t.f%7Cc%3A%23b39c82ff%2Ct%3Acity%7Ce%3Al.t.s%7Cc%3A%232b2b2bff%2Ct%3Awater%7Ce%3Al.t.f%7Cc%3A%23d69563ff%2Ct%3Awater%7Ce%3Al.t.s%7Cc%3A%23242f3eff%2Ct%3Alocal%7Ce%3Ag.f%7Cc%3A%23494236ff%2Ct%3Alocal%7Ce%3Ag.s%7Cc%3A%23ffffff00%2Ct%3Afourlevelway%7Ce%3Ag.f%7Cc%3A%234d4234ff%2Ct%3Afourlevelway%7Ce%3Ag.s%7Cc%3A%23ffffff00%2Ct%3Atertiaryway%7Ce%3Ag.f%7Cc%3A%234e4d38ff%2Ct%3Atertiaryway%7Ce%3Ag.s%7Cc%3A%23ffffff00%2Ct%3Atertiaryway%7Ce%3Al.t.f%7Cc%3A%23989275ff%2Ct%3Afourlevelway%7Ce%3Al.t.f%7Cc%3A%23759879ff%2Ct%3Ahighway%7Ce%3Al.t.f%7Cc%3A%23989275ff%2Ct%3Ahighway%7Ce%3Ag.f%7Cc%3A%239e7d60ff%2Ct%3Ahighway%7Ce%3Ag.s%7Cc%3A%23554631ff%2Ct%3Aprovincialway%7Ce%3Ag.f%7Cc%3A%239e7d60ff%2Ct%3Aprovincialway%7Ce%3Ag.s%7Cc%3A%23554631ff%2Ct%3Atertiaryway%7Ce%3Al.t.s%7Cc%3A%231a2e1cff%2Ct%3Afourlevelway%7Ce%3Al.t.s%7Cc%3A%231a2e1cff%2Ct%3Ahighway%7Ce%3Al.t.s%7Cc%3A%231a2e1cff%2Ct%3Anationalway%7Ce%3Al.t.s%7Cc%3A%231a2e1cff%2Ct%3Anationalway%7Ce%3Al.t.f%7Cc%3A%23989275ff%2Ct%3Anationalway%7Ce%3Ag.f%7Cc%3A%239e7d60ff%2Ct%3Anationalway%7Ce%3Ag.s%7Cc%3A%23554631ff%2Ct%3Acityhighway%7Ce%3Ag.f%7Cc%3A%239e7d60ff%2Ct%3Acityhighway%7Ce%3Ag.s%7Cc%3A%23554631ff%2Ct%3Aarterial%7Ce%3Ag.f%7Cc%3A%239e7d60ff%2Ct%3Aarterial%7Ce%3Ag.s%7Cc%3A%23554631fa%2Ct%3Amedicallabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Amedicallabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aentertainmentlabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Aentertainmentlabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aestatelabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Aestatelabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Abusinesstowerlabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Abusinesstowerlabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Acompanylabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Acompanylabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Agovernmentlabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Agovernmentlabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Arestaurantlabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Arestaurantlabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Ahotellabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahotellabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Ashoppinglabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Ashoppinglabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Alifeservicelabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Alifeservicelabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Acarservicelabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Acarservicelabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Afinancelabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Afinancelabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aotherlabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Aotherlabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aairportlabel%7Ce%3Al%7Cv%3Aon%2Ct%3Aairportlabel%7Ce%3Al.t.f%7Cc%3A%23d69563ff%2Ct%3Aairportlabel%7Ce%3Al.t.s%7Cc%3A%2317263cff%2Ct%3Aairportlabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Al%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Al%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Al%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Al%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Aprovincialway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Aprovincialway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Aprovincialway%7Ce%3Al%7Cv%3Aoff%2Ct%3Aprovincialway%7Ce%3Al%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Ag%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Ag%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Al%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Al%7Cv%3Aoff%2Ct%3Abuilding%7Ce%3Aundefined%7Cc%3A%23836a3cb3%2Ct%3Abuilding%7Ce%3Aundefined%7Cc%3A%23413621ff%2Ct%3Abuilding%7Ce%3Ag.s%7Cc%3A%231a212eff%2Ct%3Aroad%7Ce%3Al.t.f%7Cc%3A%23989275ff%2Ct%3Aroad%7Ce%3Al.t.s%7Cc%3A%23292929ff%2Ct%3Aprovincialway%7Ce%3Al.t.f%7Cc%3A%23989275ff%2Ct%3Acityhighway%7Ce%3Al.t.f%7Cc%3A%23989275ff%2Ct%3Aarterial%7Ce%3Al.t.f%7Cc%3A%23989775ff%2Ct%3Aprovincialway%7Ce%3Al.t.s%7Cc%3A%231a2e1cff%2Ct%3Acityhighway%7Ce%3Al.t.s%7Cc%3A%231b1b1bff%2Ct%3Aarterial%7Ce%3Al.t.s%7Cc%3A%231a2e1cff%2Ct%3Alocal%7Ce%3Al%7Cv%3Aoff%2Ct%3Amanmade%7Ce%3Al.t.f%7Cc%3A%23d69563ff%2Ct%3Amanmade%7Ce%3Al.t.s%7Cc%3A%2317263cff%2Ct%3Asubwaystation%7Ce%3Ag%7Cv%3Aoff%2Ct%3Atransportationlabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Atransportationlabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Aestate%7Ce%3Ag%7Cc%3A%232a3341ff%2Ct%3Adistrict%7Ce%3Al.t.f%7Cc%3A%2397846eff%2Ct%3Adistrict%7Ce%3Al.t.s%7Cc%3A%231f1f1fff%2Ct%3Ascenicspots%7Ce%3Al.t.f%7Cc%3A%2397846eff%2Ct%3Ascenicspotslabel%7Ce%3Al.t.f%7Cc%3A%2397846eff%2Ct%3Ascenicspotslabel%7Ce%3Al.t.s%7Cc%3A%23242424ff%2Ct%3Ascenicspots%7Ce%3Ag%7Cv%3Aon%7Cc%3A%236f6f6fff`,
      mapStyle: `https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20200716&scale=1&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&styles=t%3Aland%7Ce%3Ag%7Cv%3Aon%7Cc%3A%23202228ff%2Ct%3Awater%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23202228ff%2Ct%3Abuilding%7Ce%3Ag.f%7Cv%3Aon%7Cc%3A%23151619ff%2Ct%3Abuilding%7Ce%3Ag.s%7Cv%3Aon%7Cc%3A%23060400ff%2Ct%3Awater%7Ce%3Ag%7Cv%3Aon%7Cc%3A%23090a12ff%2Ct%3Avillage%7Ce%3Al%7Cv%3Aoff%2Ct%3Atown%7Ce%3Al%7Cv%3Aoff%2Ct%3Adistrict%7Ce%3Al%7Cv%3Aoff%2Ct%3Acountry%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Acity%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Acontinent%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Apoi%7Ce%3Al%7Cv%3Aoff%2Ct%3Apoi%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Ascenicspotslabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Ascenicspotslabel%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Atransportationlabel%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Atransportationlabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aairportlabel%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Aairportlabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Ag.f%7Cv%3Aon%7Cc%3A%23fdcd2cff%2Ct%3Aroad%7Ce%3Ag.s%7Cv%3Aon%7Cc%3A%23fdcd2cff%2Ct%3Aroad%7Ce%3Ag%7Cw%3A4%2Ct%3Agreen%7Ce%3Ag%7Cv%3Aon%7Cc%3A%232f3239ff%2Ct%3Ascenicspots%7Ce%3Ag%7Cv%3Aon%7Cc%3A%23202228ff%2Ct%3Ascenicspots%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Ascenicspots%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Acontinent%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Acountry%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Acity%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Acity%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Ascenicspotslabel%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Aairportlabel%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Atransportationlabel%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Arailway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Asubway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Ahighwaysign%7Ce%3Al%7Cv%3Aoff%2Ct%3Anationalwaysign%7Ce%3Al%7Cv%3Aoff%2Ct%3Anationalwaysign%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aprovincialwaysign%7Ce%3Al%7Cv%3Aoff%2Ct%3Aprovincialwaysign%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Atertiarywaysign%7Ce%3Al%7Cv%3Aoff%2Ct%3Atertiarywaysign%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Asubwaylabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Asubwaylabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A40%2Ct%3Aroad%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23444c5970%7Cw%3A1%2Ct%3Ashopping%7Ce%3Ag%7Cv%3Aoff%2Ct%3Ascenicspots%7Ce%3Al%7Cv%3Aon%2Ct%3Ascenicspotslabel%7Ce%3Al%7Cv%3Aoff%2Ct%3Amanmade%7Ce%3Ag%7Cv%3Aoff%2Ct%3Amanmade%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighwaysign%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Awater%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%232f323900%2Ct%3Aroad%7Ce%3Ag%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Ag%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Ag%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Ag%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Al%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Al%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Al%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Ahighway%7Ce%3Ag.f%7Cv%3Aon%7Cc%3A%23fdcd2cff%2Ct%3Ahighway%7Ce%3Ag.s%7Cc%3A%231c4f7eff%2Ct%3Ahighway%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Ahighway%7Ce%3Ag%7Cw%3A3%2Ct%3Anationalway%7Ce%3Ag.f%7Cv%3Aon%7Cc%3A%23fdcd2cff%2Ct%3Anationalway%7Ce%3Ag.s%7Cc%3A%231c4f7eff%2Ct%3Anationalway%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Anationalway%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Anationalway%7Ce%3Ag%7Cw%3A3%2Ct%3Aprovincialway%7Ce%3Ag.f%7Cv%3Aon%7Cc%3A%23fdcd2cff%2Ct%3Acityhighway%7Ce%3Ag.f%7Cv%3Aon%7Cc%3A%23fdcd2cff%2Ct%3Aarterial%7Ce%3Ag.f%7Cv%3Aon%7Cc%3A%23fdcd2cff%2Ct%3Atertiaryway%7Ce%3Ag.f%7Cv%3Aon%7Cc%3A%23fdcd2cff%2Ct%3Afourlevelway%7Ce%3Ag.f%7Cv%3Aon%7Cc%3A%23fdcd2cff%2Ct%3Alocal%7Ce%3Ag.f%7Cv%3Aon%7Cc%3A%23fdcd2cff%2Ct%3Aprovincialway%7Ce%3Ag.s%7Cv%3Aon%7Cc%3A%23dfaa04ff%2Ct%3Acityhighway%7Ce%3Ag.s%7Cv%3Aon%7Cc%3A%23dfaa04ff%2Ct%3Aarterial%7Ce%3Ag.s%7Cv%3Aon%7Cc%3A%23dfaa04ff%2Ct%3Atertiaryway%7Ce%3Ag.s%7Cv%3Aon%7Cc%3A%23dfaa04ff%2Ct%3Afourlevelway%7Ce%3Ag.s%7Cv%3Aon%7Cc%3A%23dfaa04ff%2Ct%3Alocal%7Ce%3Ag.s%7Cv%3Aon%7Cc%3A%23dfaa04ff%2Ct%3Alocal%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Alocal%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Afourlevelway%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Atertiaryway%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Aarterial%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Acityhighway%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Aprovincialway%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23b8f3ffff%2Ct%3Aprovincialway%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Acityhighway%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Aarterial%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Atertiaryway%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Afourlevelway%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%23ffffffff%7Cw%3A1%2Ct%3Afourlevelway%7Ce%3Ag%7Cw%3A1%2Ct%3Atertiaryway%7Ce%3Ag%7Cw%3A1%2Ct%3Alocal%7Ce%3Ag%7Cw%3A1%2Ct%3Aprovincialway%7Ce%3Ag%7Cw%3A3%2Ct%3Acityhighway%7Ce%3Ag%7Cw%3A3%2Ct%3Aarterial%7Ce%3Ag%7Cw%3A3%2Ct%3Ahighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Al%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Al%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Al%7Cv%3Aoff%2Ct%3Anationalway%7Ce%3Al%7Cv%3Aoff%2Ct%3Aprovincialway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Aprovincialway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Aprovincialway%7Ce%3Al%7Cv%3Aoff%2Ct%3Aprovincialway%7Ce%3Al%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Ag%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Acityhighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Ag%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Al%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Al%7Cv%3Aon`,
      mapStyle1: `https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20200716&scale=2&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&styles=
        t:land|e:g|v:on|c:#202228ff,
        t:water|e:l.t.f|v:on|c:#202228ff,
        t:building|e:g.f|v:on|c:#151619ff,
        t:building|e:g.s|v:on|c:#060400ff,
        t:water|e:g|v:on|c:#090a12ff,
        t:village|e:l|v:off,
        t:town|e:l|v:off,
        t:district|e:l|v:off,
        t:country|e:l.t.f|v:on|c:#b8f3ffff,
        t:city|e:l.t.f|v:on|c:#b8f3ffff,
        t:continent|e:l.t.f|v:on|c:#b8f3ffff,
        t:poi|e:l|v:off,
        t:poi|e:l.i|v:off,
        t:scenicspotslabel|e:l.i|v:off,
        t:scenicspotslabel|e:l.t.f|v:on|c:#b8f3ffff,
        t:transportationlabel|e:l.t.f|v:on|c:#b8f3ffff,
        t:transportationlabel|e:l.i|v:off,
        t:airportlabel|e:l.t.f|v:on|c:#b8f3ffff,
        t:airportlabel|e:l.i|v:off,
        t:road|e:g.f|v:on|c:#fdcd2cff,
        t:road|e:g.s|v:on|c:#fdcd2cff,
        t:road|e:g|w:4,
        t:green|e:g|v:on|c:#2f3239ff,
        t:scenicspots|e:g|v:on|c:#202228ff,
        t:scenicspots|e:l.t.f|v:on|c:#b8f3ffff,
        t:scenicspots|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:continent|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:country|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:city|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:city|e:l.i|v:off,
        t:scenicspotslabel|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:airportlabel|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:transportationlabel|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:railway|e:g|v:off,
        t:subway|e:g|v:off,
        t:highwaysign|e:l|v:off,
        t:nationalwaysign|e:l|v:off,
        t:nationalwaysign|e:l.i|v:off,
        t:provincialwaysign|e:l|v:off,
        t:provincialwaysign|e:l.i|v:off,
        t:tertiarywaysign|e:l|v:off,
        t:tertiarywaysign|e:l.i|v:off,
        t:subwaylabel|e:l|v:off,
        t:subwaylabel|e:l.i|v:off,
        t:road|e:l.t.f|v:on|c:#ffffffff|w:40,
        t:road|e:l.t.s|v:on|c:#444c5970|w:1,
        t:shopping|e:g|v:off,t:scenicspots|e:l|v:on,
        t:scenicspotslabel|e:l|v:off,
        t:manmade|e:g|v:off,
        t:manmade|e:l|v:off,
        t:highwaysign|e:l.i|v:off,
        t:water|e:l.t.s|v:on|c:#2f323900,
        t:road|e:g|v:off,
        t:road|e:g|v:off,
        t:road|e:g|v:off,
        t:road|e:g|v:off,
        t:road|e:l|v:off,
        t:road|e:l|v:off,
        t:road|e:l|v:off,
        t:road|e:l|v:off,
        t:highway|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:highway|e:g.f|v:on|c:#fdcd2cff,
        t:highway|e:g.s|c:#1c4f7eff,
        t:highway|e:l.t.f|v:on|c:#b8f3ffff,
        t:highway|e:g|w:3,
        t:nationalway|e:g.f|v:on|c:#fdcd2cff,
        t:nationalway|e:g.s|c:#1c4f7eff,
        t:nationalway|e:l.t.f|v:on|c:#b8f3ffff,
        t:nationalway|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:nationalway|e:g|w:3,
        t:provincialway|e:g.f|v:on|c:#fdcd2cff,
        t:cityhighway|e:g.f|v:on|c:#fdcd2cff,
        t:arterial|e:g.f|v:on|c:#fdcd2cff,
        t:tertiaryway|e:g.f|v:on|c:#fdcd2cff,
        t:fourlevelway|e:g.f|v:on|c:#fdcd2cff,
        t:local|e:g.f|v:on|c:#fdcd2cff,
        t:provincialway|e:g.s|v:on|c:#dfaa04ff,
        t:cityhighway|e:g.s|v:on|c:#dfaa04ff,
        t:arterial|e:g.s|v:on|c:#dfaa04ff,
        t:tertiaryway|e:g.s|v:on|c:#dfaa04ff,
        t:fourlevelway|e:g.s|v:on|c:#dfaa04ff,
        t:local|e:g.s|v:on|c:#dfaa04ff,
        t:local|e:l.t.f|v:on|c:#b8f3ffff,
        t:local|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:fourlevelway|e:l.t.f|v:on|c:#b8f3ffff,
        t:tertiaryway|e:l.t.f|v:on|c:#b8f3ffff,
        t:arterial|e:l.t.f|v:on|c:#b8f3ffff,
        t:cityhighway|e:l.t.f|v:on|c:#b8f3ffff,
        t:provincialway|e:l.t.f|v:on|c:#b8f3ffff,
        t:provincialway|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:cityhighway|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:arterial|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:tertiaryway|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:fourlevelway|e:l.t.s|v:on|c:#ffffffff|w:1,
        t:fourlevelway|e:g|w:1,
        t:tertiaryway|e:g|w:1,
        t:local|e:g|w:1,
        t:provincialway|e:g|w:3,
        t:cityhighway|e:g|w:3,
        t:arterial|e:g|w:3,
        t:highway|e:g|v:off,
        t:highway|e:g|v:off,
        t:highway|e:g|v:off,
        t:highway|e:g|v:off,
        t:highway|e:l|v:off,
        t:highway|e:l|v:off,
        t:highway|e:l|v:off,
        t:highway|e:l|v:off,
        t:nationalway|e:g|v:off,
        t:nationalway|e:g|v:off,
        t:nationalway|e:g|v:off,
        t:nationalway|e:g|v:off,
        t:nationalway|e:l|v:off,
        t:nationalway|e:l|v:off,
        t:nationalway|e:l|v:off,
        t:nationalway|e:l|v:off,
        t:provincialway|e:g|v:off,
        t:provincialway|e:g|v:off,
        t:provincialway|e:l|v:off,
        t:provincialway|e:l|v:off,
        t:cityhighway|e:g|v:off,
        t:cityhighway|e:g|v:off,
        t:cityhighway|e:g|v:off,
        t:cityhighway|e:g|v:off,
        t:cityhighway|e:l|v:off,
        t:cityhighway|e:l|v:off,
        t:cityhighway|e:l|v:off,
        t:cityhighway|e:l|v:off,
        t:arterial|e:g|v:off,
        t:arterial|e:l|v:off,
        t:road|e:l|v:on
      `,
      mapStyle2: ``
    };
  }
};
