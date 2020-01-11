var captchaCode;
grecaptcha.ready(
    function fafa()
    {
        grecaptcha.execute('6LfOEJYUAAAAABCgQ7XysiWy9SpLd_4FyuX2SErc',
            {
                action: 'captcha'
            })
            .then(function(token)
            {
                captchaCode = token;
                return captchaCode;
            });
    });