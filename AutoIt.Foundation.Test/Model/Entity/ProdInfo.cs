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
//      <SelectBox Title = "������Ʒ" Field="ProdID"  Source="/ProdInfo"/>
//      <SelectBox Title = "�Ƽ�λ����" Field="Name" Source="RecomendType"/>
//      <SelectBox Title = "��������" Field="LinkType" Source="LinkType"/>
//      <SelectBox Title = "�ļ�����" Field="PackName" Source="/AppInfo"/>
//      <TextBox Title = "Ӧ������" Field="AppName" Editable="false"/>
//      <TextBox Title = "�Ƽ���" Field="Content"/>
//      <TextBox Title = "����" Field="Descript"/>
//      <DateBox Title = "��������" Field="StartTime" Mode="DateTime"/>
//      <DateBox Title = "��������" Field="EndTime" Mode="DateTime"/>
//      <SelectBox Title = "��ʾ��ʽ"  Field="ShowMode" Source="ShowMode"/>
//      <NumberBox Title = "��ʾ����" Field="ShowCount"/>
//      <SelectBox Title = "��ʾʱ��" Field="ShowTimeMode" Source="ShowTimeMode"/>
//      <NumberBox Title = "����ʱ��" Field="DisplaySecond"/>
//      <SelectBox Title = "���'X'" Field="IsCloseToOpen" Source="OpenState"/>
//      <SliderBox Title = "����" Field="Probability"/>
//      <NumberBox Title = "����" Field="DayLimit"/>
//    </Grid>
//  </Form>
//</Page>
}