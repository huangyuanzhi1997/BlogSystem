package top.huangyuanzhi.controller.home;

import top.huangyuanzhi.controller.util.MapCache;

/**
 * @Description TODO
 * @Author Administrator
 * @Date 2020/9/3 下午 01:27
 * @Blog https:www.huangyuanzhi.top
 */
public abstract class AbstractController {
    public static String THEME = "themes";

    protected MapCache cache = MapCache.single();

    public String render(String viewName) {
        return THEME + "/" + viewName;
    }
}
