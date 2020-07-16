let captchaCode;
grecaptcha.ready(
    function getCaptchaCode()
    {
        grecaptcha.execute('6Lc_QpcUAAAAAD57tK2_u3anNnSoKM0FmvZF3QdO',
            {
                action: 'captcha'
            })
            .then(function (token)
            {
                captchaCode = token;
                return captchaCode;
            });
    });

