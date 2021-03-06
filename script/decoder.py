#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pprint import pprint

CODED = [
    "1w4yxnmnmgxn4wwy41ans1gym1gnf1tnmsey1oaygaaymg4nog5nyn4nenfyg8oyngfnafon1omya8ayws5yfwwyeg8ysgtnxwwnay5nennyefnngn/nyynnnt1fng1enggyynfanafontoey4oeyefgny14nmysy1etytftnt15agfeafwtayg4ng5anoafna8nnay1aaxmyoasngonaolons5g11gnyaoty/oxo1awwywxa1xeyw1gewaf8wx1tf1w4wxem1myxf4www48aws0gwmeg1fgtwmyef1gawg1awmf4foy5fyw4feef1g5own8fwagow1wmfaoafwg5wfy/wwex81",
    "tf1w1aoax14atfmwnygasyeway5atyga88fwogswes8w51ya51aaga1atawwgowwf1mamn5axg5wooewx8ywmfgwy1twy1na5fgaaw4aeaew8n8afa/mw5amagy1a5ywa41gw4n4asnoafg5wfgewwnnaoyoawwxwxe4w1ntamy4sgn5s8fwse1maa5nasstaxoxa4wss5xxw5stamggsflfa55fy1yewogew/5x4yefnwgxxyxeafs1tf5nmf8yxntf1f1eoyxw4ntfmfnogfs0efae5yt1gf8wfno1sfey8f5nyn5wangf1ntewyg5wffomfm15fxf5nogenx1yfmw/gfyxty",
    "tf1wwa1a81aayfewfyfawy4wtyoayytas8ewegtwgsnwg14ag1faxaaaxafweoxwx1oamnea1g5waoowm84wefww41xwe1watfwaswwayamwnnna5a/yweaga4y8awyyan1sw1naawnfaogfwoggwenwagyoa8wnwmetwwnxayy5s8nmsofesn1xa55sags1a8oyafw4s8x8wysmafgysolyaw5ty4w8wgg5w/exnygfsw5xey5eefw15fmn8fgysntf1fwe1y8wanyfeffoffw04fteoyy1tfswene1tfgynfgn4ngwfnxfanxefye5xfxoofm1ef1f5nagonm14few/wf4xxy",
    "88twesxwtywwgnta4o8wnatwyy1ayn8a1wxasnyaywta8wgwgoxwmw8a81gwxgwwsstwxgawtyxwywawnfawnfeaw18anfawn8mw1aaa1omwn1y/a4y8w41nwawswmffamywaya8aennwwo1wmfewxs8wos8wyfeaxv4w4nsafynsgnfseffst1eascaa4swaxoyaawestb5w4sya5gss5d5awc4y51/1wwgaw8bwyxynw4y5w8bgy8nmn4y4nfbyf8ftne1xftwwngvty4o8fnotfyc1fyv8y1yxnsnyfyptf81gfgnxfmy8n8ygfxvwysftfxcaftoxfy/sannbay",
    "8ftwxnewaf4wsf8wnagwoywafwwwfw4axyya51watyxwaftwmfownowwtg1wg15wof1aofsata1wwofwtyswmnmw4gswsa1w88/1w5wwwfafwowea5y4wtamagwya81gwoo1wwsewgagwwgawmf1aaa5wyfxa5gmwx4ww8nya4yasgn5ssfas81waoitaxsta8oga/mwxsxkfwastawgfsf5tagiay41aw1gawfgtwgkwy8ggwao1wa1gwok5yxkxf8ytnxnefa54ns48ynwgno4wyfiwffn4fxfyf5n/wftkxy",
    "5fm8s11nxawngaxn88n8nam81fnng8x8oy1no1wnn81no888egfn8ffntaongwfna85n4sxnnao8o88nfsn8gatn8a/gnyfw84w48egmn8na88n88581n4nxn88tngoxn5w18nnx8nf58sf18ywfnw1gneygn1nn8fkonysw8afaots8ofaoo/5w58yuy8mow8g188nnto83nnyox8my4oxts8nuxfewyn5y1nf35fw88neynnnwtna3gffsgaeiwa5gmasn1sxwwagk/xa83nf",
    "ofeo4f8owfwafn5o5a8aanna485a8owa5neota5oeago8saofwfaxyxan8tagomaeg5anoxomfaatamonnfaewyaayta4sxa5g5amoeawsaoe/y5amn8agaoo1yaasw5a8waa18eofo4o1faawf4axnno8nyawanoxjoa88wownog18tg8ssgofeowrfong8otyyo5axgy74asggowwwgyufogr/yntg4axn8ae7fnm8was78nn15s4a18wfssyjnsoae84j8nwfwsfy5s5j8sa8ns4s5s8fws5aestf5sejgn87asfnf8x8xsn1tsgjmney58njx/sm7an",
    "5f5n5aono88nss484a88fyenfaonantnnf1nmfonnaon8ft8nsfnynan88f8yao8mnw8mws881enawo8x8xn1fa8wwn8y/f1naf4ng8n8wwmn58s8411n5g8nwfmnma4n5wenm888t818fosn4nw848o84888nfa8e21nssx8yfmo1snooatoowo8ed/a8aon8w1e85neosptn8oa8xyao4rm8gdaf4y1ntyxnopofesyntpff5yen8ymntwyn425f5z5a5woaod8aso4a418afne/sfpof",
    "4nmyooyyw81ymntygyxyn1yy51gnynoymnwyysfyt85yawmnnaoyxgxnsn8nxwayf1enfway8wsn48aywynnan8nesyyfw/mygnxn4a4ysnnysw1n5y4yxsty4ywyfynnty8n8wonggoymwgnyf5ny1mngsnya1nysvfysf5nf1eanfyamwsawgxnnc1n/aatne88n5yyagbnytannwoxasdxn4c41soyyfotywb51efny4bg14ysf5fnwnvmwegxw4nmwonywwg1wmvt1gyxfnfyw59/gwybo1",
    "w81ago1aeneomonaon8oowfaxn8oy1tannsosn1otowo1gwagaso4ooa8oxoasfoafgamayoswtag8tawfwom8tof8gowoaa5aga81tas8gaoasoto8afywaxg/gayo4om8eaw8monwoamaeaasgoysyot1oafaoaw08a48go1n1go85ggswgtfgoemmooggo5y1oaatgxegaagfoxwyge6yoymxnwwnaawfa8e5n58nagennwss8/maw8w85st858wf18g01neae8myn8om8soyfsx08sy8t8nlsss01ntaw81mwsgyss4so888xsanf8aagsm0ynsat8gmtswywsmwt8ffgswlas50gn88tss1gsos/s8te8n",
    "4ogyngsy4nyyosmyyy4ng8gyg8mygnny4gsn4ggy4nsygyayeyoya8gysseyggenwynyan4ngyyy8nxyw1xymany11syeyanxaty4ysyeggn5/wgyoggyoytna8myt8eymgay5asyewfnag1yofmy8w8y4nxytywytjoy4f4ny1ga8f5a1w8atgyn5rwnyannt8ongyfan7yygawnoona4uyntr/e14gwyeomy1781of4ya7a11f1wewxfffnwwo1f4jgwnfsw4wyfojm1yg4wghgwgjm1gfnw4rsw4rgw47swgyafejo1awgwsrewggewwfnfag4/fg7y1",
    "1ooy4gnnff1nnyeyofoyas8yenyyaggyo1myxytnfa8ygsgysasygganwy4yasaysngn4fxynwsy8f5ymsyye8xyn1oyoynn51yyg14y1/nwyng5yggnnwffyogfys1an4gyywy5ysfnygy8yeaaymfxy1nnngwgn80sy5f4nx1waefeaowoaagtn5m5nfaynx8nn4yoane8yya1nto/mam6fnxme1mg8ywoeywe11totyagyyse51ewffo1mf8gow1fow4snwf011n1efofowaw8wemywafgfo0m1xwtffs8wgagws8swgmawwq4/waea1"
]
DECODED = [
    "79f8d1a1a6d1f998f7213768a76107e1a3b875286228a6f156c181f1b10864581601205175a8242893c80998b64836e1d99128c1b118b01161/188111e70167b1668810212051e5b8f5b8b06187f1a8387be8e0e1e7c260b209e286f16c215201241128722da8523165125y513c67761825e8/5d5729989d27db8976b92049d7e079f9dba7a8d0f999f4293z69ab6706e9a8b076296729a0f058c089f0bb076c591409265979a0252096c908/99bd47",
    "e0797252d7f2e0a9186238b928c2e86244095639b349c782c7226272e299659907a2a1c2d6c955b9d489a06987e98712c06229f2b2b9414202/a9c2a26872c892f769f1f2315206c906b99112585299d9dbf971e2a8f361c34093b7a22c1233e2d5d2f933cdd9c3e2a6630y02cc0878b956b9/cdf8b0196dd8db2037e0c1a048d1e0707b58d9f1e0a015603zb02bc8e76049015730b840c181c9216071eb986c9005a0a7c0d0c156b1d780a9/608de8",
    "e0799272472280b9080298f9e85288e234b9b6e9631967f26702d222d209b5d9d752a1b276c92559a4f9b099f7d9b792e092399282a91112c2/89b262f842988217397122910256095669b19268524919abe991d288c341a350b317d2cc326372458209f34d4983a206835y829ce8f94966c9/bd186039cdb8cbb097c0a1406831e0709b78492180b005009zf0eb5887e039b1b7e0681061f16901d021db08bcd0d550a7b070c12651a7f0b9/90fdd8",
    '44e9b3d9e89961e2f54912e98872814279d2318289e2496965d9a9424769d69933e9d629e8d98929102910b29742102914a9722275a9178/2f849f7192939a002a8928242b1199579a0b9d349534980b2dtf9f13208136103b003e7b23u22f392d58229b3evc9f382c633cqc29uf8c7/7996294v98d819f8c94v6841a1f8f10v8040e1b7d0e9916te8f54015e08u708t4878d131808re0476061d0a8414860dt9830e0du20e5d08/3211v28',
    '40e9d1b920f9304912695892099909f2d882c792e8d920e9a0591599e67967c950725032e2799509e839a1a9f639327944/79c999020959b2c8f9e2a269824769557993b962699629a07222c980d2c6a9df994182f82361c3302347925ge2d3e24562/a9d3dh0923e296030ce26g28f729762906e96h984669257927695hc8dhd048e1d1b02cf13f4819615f980g9001f0d080c1/90ehd8',
    "c0a43771d29162d1441412a4701164d45871579114715444b6014001e251690124c1f3d112545441031462e142/618094f9f4b6a141244144c471f1d144e165d1c97411d410c4307489019761b86171140h5183942025e3450255/c9c48i84a594674411e54j1185d4a8f5de341id0b981c8710jc09441b81119e12j600362bg92c6a23173d9926h/d24j10",
    "50b5f045909201c5c2422112f4c24592c1b5e2c5b26543250902d8d214e265a2b6c215d5a022e2a51102b98228e2f3d2c6c2a5b29325b/8c2a1426255782239c2492274b505f5702290f2d11541829215dl524495915674e6433650b59m051645e885c2d68nf2366599968i056m/81e6f2d142bn01a4923n4117c3f27490338l1352b4fl41909308c3cl432413f3c34093c2b3e0c3bl614n230104d4d317e36la1b8c41ld/3an21",
    "c0c1c251544133f4f24408b1025121e11071a051125140e41301812144048254a194a93447b12954d4d1702499148/07120f1641499a1c434f771c64190a1a2f1c9b1a444e4740531f194f454f4441024bp7133d480a5731552e55954bq/24251497b4c1b53re14524d825fma46q20f871e8d15r50b381er00c8b148a1e981fpc0coc2c9525q4235f2f74201b/30r50",
    "f1a855889478a1e868d81788c7618158a1988308e4c829a11258d6d13141d92807b109284931f42898112141b38809/a861d1f2f831183971c8f8d3e8f8980811e84149516658a96180c187a1631827183t0830c107b21082a93296d11u71/22e1b441c8826v18e21195d23qd1fuf7358805e89vc7b018fv67f830c0191ta9b6d9f1a951899679ate768d01089cs/698v57",
    "94726572b1b5a51251455902d14587e211353175e59576926235f55245d523052062a28539e264e29095a4e504659522c26247e234625235e5420892d6/6285f5a4b294a51952a2b223658385e75202529z42f465717654c66396e065baa55665c87522e6db622605d986bw858ad1991229024bc1c4126b119334/a29494c3e4c490746z71b2b4a8145a435803dz4384e41y333z71e2947a936833f35444d321042263az8132e46ae39893a9e400639y23cz6144e3376353/34eb41",
    "f5681638f18853a888f1646864a86118f631f668f1386828b858246833b866b1981821f1688841d897d8a2187738b821d2e8f838b661c/968566858e124a8e4b8a628c238b901267850a84948f1d8e898el58f0f1876240c27942e681cm918211e45168021n8862915512fi81em/b7f698b5a87n4750f82n277079b9d000199570fl691039f9805la786f96k696la76019fm39fm69fn396820bl5729693mb966b9901026f/06n87",
    "7558f611007118b850582348b188266857a8d8e1024863683238662198f823283161f0d8193840c8a388b4d817585811c78867f87/19816c86611900856083721f68898c830186848b228a0d8711169614z38c0f1d792b0b2595226e1cac10281d411f8521b488271e5/a2aw01dab7a64895b89b77e5e826883bc7b90057a046597059f3190z7717b050592949ba8920605za7d9e00349626934396a299xf/92b27"
]

ASSOCIATION = {}

for (source, target) in zip(CODED, DECODED):

	for i in range(len(source)):
		if source[i] in ASSOCIATION and ASSOCIATION[source[i]] != target[i]:
			print('ERROR')

		ASSOCIATION[source[i]] = target[i]

pprint(ASSOCIATION)