package top.huangyuanzhi.constant;

import java.util.HashMap;
import java.util.Map;

/**
 * @Description TODO
 * @Author Administrator
 * @Date 2020/09/05 下午 08:35
 * @Blog https:www.huangyuanzhi.top
 */
public class WebConst {

    public static Map<String, String> initConfig = new HashMap<>();

    public static String LOGIN_SESSION_KEY = "login_user";

    public static final String USER_IN_COOKIE = "S_L_ID";

    /**
     * AES加密秘钥
     */
    public static String AES_SALT = "0123456789abcdef";

}
