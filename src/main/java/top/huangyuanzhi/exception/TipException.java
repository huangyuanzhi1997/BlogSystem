package top.huangyuanzhi.exception;

/**
 * @Description TODO
 * @Author Administrator
 * @Date 2020/09/05 下午 08:46
 * @Blog https:www.huangyuanzhi.top
 */
public class TipException extends RuntimeException {
    public TipException() {
    }

    public TipException(String message) {
        super(message);
    }

    public TipException(String message, Throwable cause) {
        super(message, cause);
    }

    public TipException(Throwable cause) {
        super(cause);
    }
}
