import { Box, Container, Flex, Icon, IconButton, useColorMode } from '@chakra-ui/react';
import { BiHome, BiMoon, BiSun } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<Box paddingY={4} position={'absolute'} top={0} right={0}>
			<Container
				maxW={'container.lg'}
				as={Flex}
				gap={2}
				alignItems={'center'}
				justifyContent={'space-between'}
			>
				<IconButton
					aria-label={'Go to main page'}
					colorScheme={colorMode === 'dark' ? 'secondary' : 'primary'}
					as={Link}
					to={'/'}
				>
					<Icon as={BiHome} />
				</IconButton>

				<IconButton
					aria-label={'Toggle dark mode'}
					colorScheme={colorMode === 'dark' ? 'secondary' : 'primary'}
					onClick={toggleColorMode}
				>
					{colorMode === 'dark' ? <Icon as={BiSun} /> : <Icon as={BiMoon} />}
				</IconButton>
			</Container>
		</Box>
	);
};

export default Header;
