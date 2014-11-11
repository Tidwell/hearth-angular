"use strict";angular.module("hearthApp",["ngCookies","ngResource","ngSanitize","ngRoute","angularLocalStorage","ui.bootstrap"]).config(["$routeProvider","$locationProvider",function(a,b){b.html5Mode(!0),a.when("/main",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/owned",{templateUrl:"views/owned.html",controller:"OwnedCtrl"}).when("/links",{templateUrl:"views/links.html",controller:"LinksCtrl"}).when("/tournaments",{templateUrl:"views/tournaments.html",controller:"TournamentsCtrl"}).when("/spectate",{redirectTo:"/browse"}).when("/spectate/:id",{templateUrl:"views/spectate.html",controller:"SpectateCtrl"}).when("/play",{redirectTo:"/tournaments"}).when("/play/:id",{templateUrl:"views/play.html",controller:"PlayCtrl"}).when("/browse",{templateUrl:"views/browse.html",controller:"BrowseCtrl"}).when("/faq",{templateUrl:"views/faq.html",controller:"FaqCtrl"}).when("/profile",{templateUrl:"views/profile.html",controller:"ProfileCtrl"}).when("/profile/:battleTag",{templateUrl:"views/profile.html",controller:"ProfileCtrl"}).when("/leaderboards",{templateUrl:"views/leaderboards.html",controller:"LeaderboardsCtrl"}).when("/changelog",{templateUrl:"views/changelog.html",controller:"ChangelogCtrl"}).when("/positions",{templateUrl:"views/positions.html",controller:"PositionsCtrl"}).otherwise({redirectTo:"/tournaments"})}]),angular.module("hearthApp").controller("MainCtrl",["$scope","cards",function(a,b){a.cardWidth=235,a.cardList=b.get()}]),angular.module("hearthApp").service("cards",["$http",function(a){function b(a){return a.collectible&&"hero"!==a.type}var c={cards:[]};return{get:function(){return a.get("/cards.json").success(function(a){c.cards=a}),c},realCard:b}}]),angular.module("hearthApp").controller("OwnedCtrl",["$scope","cards","owned",function(a,b,c){a.cardList=b.get(),a.owned=c.get(),a.realCard=b.realCard,a.clearData=c.clear,a.order="name",a.reverseSort=!1,a.updateOwned=function(b){b&&b.id&&b.owned&&(a.owned.cards[b.id]=b.owned),c.save()},a.ownAll=function(){a.cardList.cards.forEach(function(b){a.realCard(b)&&a.updateOwned({id:b.id,owned:"legendary"===b.quality?1:2})})}}]),angular.module("hearthApp").service("owned",["storage",function(a){function b(){a.set("cards",d.cards)}function c(){d.cards={},b()}var d={cards:a.get("cards")||{}};return{get:function(){return d},save:b,clear:c}}]),angular.module("hearthApp").controller("LinksCtrl",["$scope",function(){}]),function(){var a=io.connect("http://www.hstrny.com:9007");angular.module("hearthApp").service("socket",["$rootScope",function(b){return{on:function(c,d){a.on(c,function(){var c=arguments;b.$apply(function(){d.apply(a,c)})})},emit:function(c,d,e){a.emit(c,d,function(){var c=arguments;b.$apply(function(){e&&e.apply(a,c)})})}}}])}(),angular.module("hearthApp").controller("NavCtrl",["$scope","user","activeTournament","$location","$dialog",function(a,b,c,d,e){a.user=b.get(),a.at=c.get(),a.login=b.login,a.logout=function(){b.logout(),d.url("/"),a.at=c.reset()},a.countUsers=b.countUsers,a.navClass=function(a){var b=d.path().substring(1).split("/")[0]||"tournaments";return"string"==typeof a?a===b?"active":"":-1!==a.indexOf(b)?"active":""},a.showlogin=function(){var a=e.dialog({backdrop:!0,keyboard:!0,backdropClick:!0,templateUrl:"views/login-modal.html",controller:"LoginModalCtrl"});a.open().then(function(){})},a.showRegister=function(){var a=e.dialog({backdrop:!0,keyboard:!0,backdropClick:!0,templateUrl:"views/register-modal.html",controller:"RegisterModalCtrl"});a.open().then(function(){})},a.btHelp=function(){var a=e.dialog({backdrop:!0,keyboard:!0,backdropClick:!0,templateUrl:"views/battletag-modal.html",controller:"BattletagModalCtrl"});a.open()}}]),angular.module("hearthApp").controller("TournamentsCtrl",["$scope","socket","tournaments","user","chat","admins",function(a,b,c,d,e,f){function g(){var a=document.getElementById("general-chat");a&&setTimeout(function(){a.scrollTop=a.scrollHeight},0)}a.tournaments=c.get(),a.chat=e.get(),a.user=d.get(),a.sendChat=e.sendChat,a.encode=e.encode,a.isAdmin=e.isAdmin,a.leaderboardLimit=10,a.countUsers=d.countUsers,a.showUsers=!1;var h=f.get();a.adminsOnline=function(){var b=[];for(var c in a.user.user.userList)-1!==h.indexOf(c)&&b.push(c);return b.length?b.join(", "):!1},a.isActive=function(a){return a&&a.tournament?"pending"===a.tournament.state||"underway"===a.tournament.state?!0:!1:!1},a.orderState=function(a){return a.tournament.state},a.$watch("chat.chatLog.length",g),setTimeout(g,500)}]),angular.module("hearthApp").controller("SpectateCtrl",["$scope","$routeParams","tournaments","activeTournament","chat",function(a,b,c,d,e){a.tournamentId=b.id,a.t=c.get(),a.encode=e.encode,a.found=!0,a.confirmJoin=function(a){d.join(a)},a.$watch("t.tournaments",function(){a.found=!1,a.t.tournaments.forEach(function(b){b.tournament.url===a.tournamentId&&(a.tournament=b,a.found=!0)})})}]),angular.module("hearthApp").service("tournaments",["socket","$location",function(a,b){var c={tournaments:[]};return a.on("tournaments:list",function(a){c.tournaments=a}),a.on("tournaments:joined",function(a){a&&b.path("/play/"+a.participant.tournamentUrl)}),a.on("tournaments:multijoin",function(){alert("You are already in a tournament.")}),{get:function(){return a.emit("tournaments:list"),c}}}]),angular.module("hearthApp").service("user",["socket","$cookies",function(a,b){function c(){h.user.error=null,a.emit("user:login",{battleTag:h.user.userName,password:h.user.password})}function d(){h.user.error=null;var c=angular.copy(h.user.userList);h.user=angular.copy(g),h.user.userList=c,b.hstbattleTag="",b.hstpw="",a.emit("user:logout"),$(".hero-unit").removeClass("loggedIn")}function e(){h.user.registererror=null,a.emit("user:register",{battleTag:h.user.userName,password:h.user.password})}function f(){var a=0;for(var b in h.user.userList)a++;return a}var g={userList:{},userName:"",password:"",loggedIn:!1,error:null,registererror:"",registered:!1},h={user:angular.copy(g)};return a.on("user:list",function(a){h.user.userList=a}),a.on("user:login",function(a){h.user.userList[a]={}}),a.on("user:loggedIn",function(a){h.user.loggedIn=!0,h.user.registered=a.registered,b.hstbattleTag=h.user.userName,b.hstpw=h.user.password,$(".hero-unit").addClass("loggedIn")}),a.on("user:loginerror",function(a){h.user.error=a}),a.on("user:registererror",function(a){h.user.registererror=a}),a.on("user:logout",function(a){delete h.user.userList[a]}),a.emit("user:list"),a.on("reconnect",function(){c()}),b.hstbattleTag&&(h.user.userName=b.hstbattleTag,h.user.password=b.hstpw||"",c()),{get:function(){return h},login:c,logout:d,register:e,countUsers:f}}]),angular.module("hearthApp").service("activeTournament",["socket",function(a){function b(){h.activeTournament.tournament.participants.forEach(function(a){h.idNameMap[a.participant.id]=a.participant.name});var a=h.participant.participant.id,b=!1;h.activeTournament.tournament.matches.forEach(function(c){"open"!==c.match.state||c.match.player1Id!==a&&c.match.player2Id!==a||(h.match&&c.match.round!==h.match.match.round&&(h.matchError=null,h.winnerReport=""),h.match=c,h.match.player1Name=h.idNameMap[c.match.player1Id],h.match.player2Name=h.idNameMap[c.match.player2Id],b=!0)}),b||(h.match=null)}function c(b){a.emit("tournaments:join",b.tournament.url)}function d(){a.emit("tournaments:drop",h.activeTournament.tournament.url)}function e(){a.emit("tournaments:report",{tournamentId:h.activeTournament.tournament.url,matchId:h.match.match.id,winnerId:h.winnerReport})}function f(){var a="/sounds/notify";document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="'+a+'.wav" type="audio/wav" /><source src="'+a+'.wav" type="audio/wav" /><embed hidden="true" autostart="true" loop="false" src="'+a+'.wav" /></audio>'}var g={activeTournament:null,winnerReport:"",match:null,matchError:null,participant:null,idNameMap:{},dropped:!1,eliminated:!1,won:!1,win:!1},h=angular.copy(g);return a.on("tournaments:dropped",function(){h.activeTournament=null,h.participant=null,h.dropped=!0}),a.on("tournaments:eliminated",function(){h.activeTournament=null,h.participant=null,h.eliminated=!0}),a.on("tournaments:won",function(){h.activeTournament=null,h.participant=null,h.won=!0}),a.on("tournaments:win",function(){h.win=!0}),a.on("tournaments:joined",function(a){h.participant=a}),a.on("tournaments:activeTournament",function(a){h.activeTournament=a,b(),"complete"===h.activeTournament.tournament.state&&(h.activeTournament=null,h.participant=null)}),a.on("tournaments:winnerConflict",function(a){h.match&&h.match.match.id===a.matchId&&(h.matchError=a)}),a.on("tournaments:started",function(a){h.activeTournament&&!h.activeTournament.tournament&&a.id===h.activeTournament.tournament.url&&f()}),{get:function(){return h},reset:function(){return h=angular.copy(g)},join:c,drop:d,sendResult:e}}]),angular.module("hearthApp").controller("PlayCtrl",["$scope","activeTournament","user","$location","chat","socket","$dialog",function(a,b,c,d,e,f,g){function h(){var a=document.getElementById("tournament-chat");a&&setTimeout(function(){a.scrollTop=a.scrollHeight},0)}a.user=c.get(),a.at=b.get(),a.chat=e.get(),a.sendChat=e.sendChat,a.encode=e.encode,a.countUsers=c.countUsers,a.showUsers=!1,a.drop=function(){var a=g.dialog({backdrop:!0,keyboard:!0,backdropClick:!0,templateUrl:"views/drop-modal.html",controller:"DropModalCtrl"});a.open().then(function(){})},a.sendResult=b.sendResult,a.$watch("at.participant",function(){a.at.participant||d.path("/tournaments")}),a.isOnline=function(b){return a.user?a.user.user.userList[b]?!0:!1:void 0},a.$watch("at.dropped",function(){if(a.at.dropped){var b=g.dialog({backdrop:!0,keyboard:!0,backdropClick:!0,templateUrl:"views/tournament-end-modal.html",controller:"TournamentEndModalCtrl",resolve:{state:function(){return"dropped"}}});b.open().then(function(){}),a.at.dropped=!1}}),a.$watch("at.eliminated",function(){if(a.at.eliminated){var b=g.dialog({backdrop:!0,keyboard:!0,backdropClick:!0,templateUrl:"views/tournament-end-modal.html",controller:"TournamentEndModalCtrl",resolve:{state:function(){return"eliminated"}}});b.open().then(function(){}),a.at.eliminated=!1}}),a.$watch("at.won",function(){if(a.at.won){var b=g.dialog({backdrop:!0,keyboard:!0,backdropClick:!0,templateUrl:"views/tournament-end-modal.html",controller:"TournamentEndModalCtrl",resolve:{state:function(){return"victory"}}});b.open().then(function(){}),a.at.won=!1}}),a.$watch("at.win",function(){if(a.at.win){var b=g.dialog({backdrop:!0,keyboard:!0,backdropClick:!0,templateUrl:"views/tournament-end-modal.html",controller:"TournamentEndModalCtrl",resolve:{state:function(){return"victorymatch"}}});b.open().then(function(){}),a.at.win=!1}}),a.$watch("chat.tournamentChatLog.length",h),setTimeout(h,500)}]),angular.module("hearthApp").service("chat",["socket","user","$http","admins",function(a,b,c,d){function e(){i.tournamentChatLog=[]}function f(b,c){if(c){var d;d="generalChat"===b?i.chatLog:i.tournamentChatLog,a.emit("chat:message",{room:b,msg:c}),d.push({msg:c,user:h.user.userName,splitUser:h.user.userName.split("#")[0],time:new Date})}}function g(){c({url:"/banlist.json",method:"GET"}).success(function(a){j=a,setTimeout(g,15e3)})}var h=b.get(),i={generalChat:"",tournamentChat:"",chatLog:[],tournamentChatLog:[]},j=[],k=d.get();return a.on("chat:message",function(a){if(-1===j.indexOf(a.user)){a.splitUser=a.user.split("#")[0],a.time=new Date;var b;b="generalChat"===a.room?i.chatLog:i.tournamentChatLog,b.push(a)}}),a.on("tournaments:dropped",e),a.on("tournaments:won",e),a.on("tournaments:eliminated",e),g(),{get:function(){return i},sendChat:f,encode:function(a){return encodeURIComponent(a)},isAdmin:function(a){return k.indexOf(a)>-1}}}]),angular.module("hearthApp").controller("BrowseCtrl",["$scope","tournaments","activeTournament","user",function(a,b,c,d){a.user=d.get(),a.at=c.get(),a.tournaments=b.get(),a.orderState=function(a){return"complete"===a.tournament.state?"x":a.tournament.state}}]),angular.module("hearthApp").controller("TournamentEndModalCtrl",["$scope","dialog","state",function(a,b,c){a.state=c,a.ok=function(){$(".modal-backdrop").hide(),b.close("ok")},a.cancel=function(){$(".modal-backdrop").hide(),b.close("cancel")}}]),angular.module("hearthApp").controller("LoginModalCtrl",["$scope","dialog","user",function(a,b,c){a.user=c.get(),a.login=c.login,a.cancel=function(){$(".modal-backdrop").hide(),b.close("cancel")},a.$watch("user.user.loggedIn",function(){a.user.user.loggedIn&&($(".modal-backdrop").hide(),b.close("ok"))})}]),angular.module("hearthApp").controller("DropModalCtrl",["$scope","dialog","activeTournament",function(a,b,c){a.at=c.get(),a.drop=function(){c.drop(),a.cancel()},a.cancel=function(){$(".modal-backdrop").hide(),b.close("cancel")}}]),angular.module("hearthApp").controller("RegisterModalCtrl",["$scope","dialog","user",function(a,b,c){a.user=c.get(),a.register=c.register,a.cancel=function(){$(".modal-backdrop").hide(),b.close("cancel")}}]),angular.module("hearthApp").controller("JoinModalCtrl",["$scope","dialog","tournament","user",function(a,b,c,d){a.user=d.get(),a.tournament=c,a.confirmJoin=function(a){b.close(a)},a.cancel=function(){b.close(!1)}}]),angular.module("hearthApp").controller("FaqCtrl",["$scope",function(){}]),angular.module("hearthApp").controller("BattletagModalCtrl",["$scope","dialog",function(a,b){a.close=function(){b.close()}}]),angular.module("hearthApp").directive("region",function(){return{template:"<span></span>",link:function(a,b,c){-1!==c.region.indexOf("[NA]")?b.text("North American"):b.text("European")}}}),angular.module("hearthApp").controller("TournamentInfoCtrl",["$scope","user","$dialog","activeTournament",function(a,b,c,d){a.user=b.get(),a.at=d.get(),a.init=function(b){a.tournament=b},a.join=function(a){var b=c.dialog({backdrop:!0,keyboard:!0,backdropClick:!0,templateUrl:"views/join-modal.html",controller:"JoinModalCtrl",resolve:{tournament:function(){return a}}});b.open().then(function(a){a&&d.join(a)})}}]),angular.module("hearthApp").controller("ProfileCtrl",["$scope","user","tournaments","$routeParams",function(a,b,c,d){function e(){var b=a.battleTag?a.battleTag:a.user.user.userName;a.myTournaments=[],a.tournaments.tournaments&&a.tournaments.tournaments.forEach(function(c){c.tournament.participants&&c.tournament.participants.forEach(function(d){d.participant.name==b&&(c.rank=d.participant.finalRank,a.myTournaments.push(c))})})}a.user=b.get(),a.tournaments=c.get(),a.myTournaments=[],d.battleTag&&(a.battleTag=d.battleTag),a.$watch("tournaments.tournaments.length",e),a.$watch("user.user.loggedIn",e)}]),angular.module("hearthApp").controller("LeaderboardCtrl",["$scope","tournaments",function(a,b){function c(){a.rankHash={},a.allRatings=[],a.tournaments.tournaments.forEach(function(b){b.tournament.participants&&b.tournament.participants.forEach(function(b){if(a.rankHash[b.participant.name]||(a.rankHash[b.participant.name]={rating:0,played:0}),b.participant.finalRank){var c;c=1===b.participant.finalRank?6:2===b.participant.finalRank?4:3===b.participant.finalRank?3:5===b.participant.finalRank?1:0,a.rankHash[b.participant.name].rating+=c,a.rankHash[b.participant.name].played++}})});for(var b in a.rankHash)"Tidwell#1482"!==b&&a.allRatings.push({name:b,rating:a.rankHash[b].rating,played:a.rankHash[b].played})}a.tournaments=b.get(),a.rankHash={},a.allRatings=[],a.strip=function(a){return a.split("#")[0]},a.$watch("tournaments.tournaments.length",c),a.$watch("user.user.loggedIn",c)}]),angular.module("hearthApp").controller("LeaderboardsCtrl",["$scope","chat",function(a,b){a.encode=b.encode,a.leaderboardLimit=1e3,a.showInfo=!0}]),angular.module("hearthApp").controller("FlashMsgCtrl",["$scope","flashMsg",function(a,b){a.flashMsg=b.get()}]),angular.module("hearthApp").service("flashMsg",["$http","$timeout",function(a,b){function c(){a.get("/flash-msg.json").success(function(a){a.msg!==d.msg&&(d.show=!0),d.msg=a.msg,b(c,6e4)}).error(function(){console.log("err"),d.msg="",d.show=!1})}var d={msg:"",show:!1};return c(),{get:function(){return d}}}]),angular.module("hearthApp").controller("ChangelogCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("hearthApp").controller("PositionsCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("hearthApp").service("admins",function(){var a=["Tidwell#1482","zzyx#1198","Zzyx#1198","Noah#1105","noah#1105","CookMySock#2517","cookMySock#2517","bakazero#2330","Bakazero#2330","likkyzero#1227","Likkyzero#1227","Zhulander#1652","mightypants7#1310","Zeus#2680","Violentce#1391","Legimos#1246"];return{get:function(){return a}}}),angular.module("hearthApp").directive("challonge",function(){return{restrict:"A",scope:{challonge:"="},link:function(a,b){function c(){a.challonge&&!angular.element(b).find("iframe").length&&$(b).challonge(a.challonge,{subdomain:"hs_tourney",theme:"2",multiplier:"1.0",match_width_multiplier:"1.0",show_final_results:"0",show_standings:"0"})}a.$watch("challonge",c)}}}),angular.module("hearthApp").controller("RootCtrl",["$scope","socket",function(a,b){a.connectionStatus="connected",b.on("reconnecting",function(){a.connectionStatus="reconnecting"}),b.on("connect",function(){a.connectionStatus="connected"}),b.on("loggedIn",function(){a.connectionStatus="connected"}),b.on("tournaments:list",function(){a.connectionStatus="connected"})}]);
