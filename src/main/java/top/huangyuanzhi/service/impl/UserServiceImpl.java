package top.huangyuanzhi.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import top.huangyuanzhi.controller.util.MyUtils;
import top.huangyuanzhi.dao.UserMapper;
import top.huangyuanzhi.exception.TipException;
import top.huangyuanzhi.model.vo.User;
import top.huangyuanzhi.model.vo.UserExample;
import top.huangyuanzhi.service.IUserService;

import javax.annotation.Resource;
import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 * 用户登录实现类
 * @author Huang
 * @since 2020-09-02
 */
@Service
public class UserServiceImpl implements IUserService {

    @Resource
    private UserMapper userDao;

    @Override
    public User login(String username, String password) {
        if (StringUtils.isBlank(username) || StringUtils.isBlank(password)) {
            throw new TipException("用户名和密码为空");
        }
        UserExample example = new UserExample();
        UserExample.Criteria criteria = example.createCriteria();
        criteria.andUsernameEqualTo(username);
        long count = userDao.countByExample(example);
        if (count < 1) {
            throw new TipException("不存在该用户");
        }
        String pwd = MyUtils.MD5encode(username + password);
        criteria.andPasswordEqualTo(pwd);
        List<User> userVoList = userDao.selectByExample(example);
        if (userVoList.size() != 1) {
            throw new TipException("用户名或者密码错误");
        }
        return userVoList.get(0);
    }
}
