package top.huangyuanzhi.dao;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import top.huangyuanzhi.model.vo.Option;
import top.huangyuanzhi.model.vo.OptionExample;

public interface OptionMapper {
    long countByExample(OptionExample example);

    int deleteByExample(OptionExample example);

    int deleteByPrimaryKey(String name);

    int insert(Option record);

    int insertSelective(Option record);

    List<Option> selectByExample(OptionExample example);

    Option selectByPrimaryKey(String name);

    int updateByExampleSelective(@Param("record") Option record, @Param("example") OptionExample example);

    int updateByExample(@Param("record") Option record, @Param("example") OptionExample example);

    int updateByPrimaryKeySelective(Option record);

    int updateByPrimaryKey(Option record);
}