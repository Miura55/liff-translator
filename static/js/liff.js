document.getElementById("logout").style.display ="none";
window.onload = function() {
    initializeLiff("1653968311-XB19ZjVO");
    // initializeLiff("1653968311-JbOa6XNl");  //test
};

function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            //LINEアプリで起動しているかどうかとログインをしているのかを判断している
            if (!liff.isInClient() && !liff.isLoggedIn()){
                window.alert("LINEアカウントにログインしてください。");
                liff.login();
            }else{
                // start to use LIFF's api
                liff.getProfile().then(function(profile) {
                    if (!liff.isInClient()){
                        document.getElementById("logout").style.display = "block"
                    }
                }).catch(function(error) {
                    window.alert('Error getting profile: ' + error);
                })
            }

        })
        .catch((err) => {
            document.getElementById('displaynamefield').textContent = err;
        });
}
// メッセージの送信
$(function() {
    $('button').click(function(e) {
        e.preventDefault();
        var val = $('#origin-lang').val();
        var click =  $(this).data('id');
        console.log(val);
        console.log(click);
        var req_body = {
            lang:click,
            user_say:val
        }
        $.ajax({
            type:"POST",
            url:"/translate",
            data:req_body,
            success: function(res, status){
                liff.shareTargetPicker([
                    {
                        type: "text",
                        text: res.translated
                    }
                ])
                .then(
                    alert("メッセージを送信します")
                )
                .catch(function(res) {
                    alert("送信に失敗しました")
                })
            },
            error: function(){
                console.log("error");
            }
        })
        
    });
});
// ログアウトの処理
function LogoutAction(){
    liff.logout();
    window.location.reload();
}