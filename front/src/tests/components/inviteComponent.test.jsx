import inviteComponent from '../../components/inviteComponent/inviteComponent';

it('should render inviteComponent correctly', () => {
    const wrapper = shallow(<inviteComponent />);
    expect(wrapper).toMatchSnapshot();
});

