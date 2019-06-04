import DescriptionProject from '../../components/descriptionProjectComponent/descriptionProjectComponent';

it('should render correctly', () => {
    const wrapper = shallow(<DescriptionProject />);
    expect(wrapper).toMatchSnapshot();
});