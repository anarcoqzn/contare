import DashboardComponent from '../../components/dasboardComponent/dashboardComponent';

it('should render DashboardComponent correctly', () => {
    const wrapper = shallow(<DashboardComponent />);
    expect(wrapper).toMatchSnapshot();
});

