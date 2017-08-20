namespace Entity
{
    public class ProdInfo:EntityBase
    {       
        public string Name { get; set; }
        public int ParentID { get; set; }
    }

//    <Page>
//  <Form>
//    <Grid>
//      <SelectBox Title = "所属产品" Field="ProdID"  Source="/ProdInfo"/>
//      <SelectBox Title = "推荐位名称" Field="Name" Source="RecomendType"/>
//      <SelectBox Title = "链接类型" Field="LinkType" Source="LinkType"/>
//      <SelectBox Title = "文件包名" Field="PackName" Source="/AppInfo"/>
//      <TextBox Title = "应用名称" Field="AppName" Editable="false"/>
//      <TextBox Title = "推荐语" Field="Content"/>
//      <TextBox Title = "描述" Field="Descript"/>
//      <DateBox Title = "推送日期" Field="StartTime" Mode="DateTime"/>
//      <DateBox Title = "推送日期" Field="EndTime" Mode="DateTime"/>
//      <SelectBox Title = "显示方式"  Field="ShowMode" Source="ShowMode"/>
//      <NumberBox Title = "显示次数" Field="ShowCount"/>
//      <SelectBox Title = "显示时间" Field="ShowTimeMode" Source="ShowTimeMode"/>
//      <NumberBox Title = "设置时间" Field="DisplaySecond"/>
//      <SelectBox Title = "点击'X'" Field="IsCloseToOpen" Source="OpenState"/>
//      <SliderBox Title = "概率" Field="Probability"/>
//      <NumberBox Title = "日限" Field="DayLimit"/>
//    </Grid>
//  </Form>
//</Page>
}