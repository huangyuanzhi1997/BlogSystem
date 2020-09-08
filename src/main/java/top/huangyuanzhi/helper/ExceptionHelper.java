package top.huangyuanzhi.helper;

import top.huangyuanzhi.exception.TipException;
import top.huangyuanzhi.model.bo.RestResponseBo;

/**
 * @Description 统一异常处理
 * @Author Administrator
 * @Date 2020/09/05 下午 08:52
 * @Blog https:www.huangyuanzhi.top
 */
public class ExceptionHelper {
    public static RestResponseBo handlerException(String msg, Exception e) {
        if (e instanceof TipException){
            msg = e.getMessage();
        }
        return RestResponseBo.fail(msg);
    }
}
